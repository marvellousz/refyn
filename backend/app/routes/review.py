from fastapi import APIRouter, UploadFile, File, HTTPException, Query, Depends
from app.services.review_service import ReviewService
from app.models import ReviewResponse, StatsResponse, User
from app.auth import get_current_active_user
from app.config import settings
from typing import List, Optional
from datetime import datetime, timezone

router = APIRouter(prefix="/api/review", tags=["review"])
review_service = ReviewService()


@router.post("/upload", response_model=ReviewResponse)
async def upload_and_review(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """Upload a code file and get a review"""
    
    content = await file.read()
    file_size = len(content)
    
    if file_size > settings.max_file_size:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.max_file_size / 1024 / 1024}MB"
        )
    
    if file_size == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded")
    
    try:
        code_content = content.decode('utf-8')
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File must be valid UTF-8 text")
    try:
        review = await review_service.create_review(
            filename=file.filename,
            content=code_content,
            file_size=file_size,
            user_id=current_user.id
        )
        
        return ReviewResponse(
            id=review.id,
            filename=review.filename,
            language=review.language,
            analysis=review.analysis,
            created_at=review.created_at
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@router.get("/{review_id}", response_model=ReviewResponse)
async def get_review(review_id: str):
    review = await review_service.get_review(review_id)
    
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    return ReviewResponse(
        id=review.id,
        filename=review.filename,
        language=review.language,
        analysis=review.analysis,
        created_at=review.created_at
    )


@router.get("/list/all", response_model=List[ReviewResponse])
async def list_reviews(
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    current_user: User = Depends(get_current_active_user)
):
    return await review_service.list_reviews(limit=limit, skip=skip, user_id=current_user.id)


@router.get("/stats/analytics", response_model=StatsResponse)
async def get_statistics(current_user: User = Depends(get_current_active_user)):
    return await review_service.get_stats(user_id=current_user.id)


@router.get("/debug/time")
async def debug_time():
    now_utc = datetime.now(timezone.utc)
    return {
        "server_time_utc": now_utc.isoformat(),
        "server_time_timestamp": now_utc.timestamp(),
        "timezone": str(now_utc.tzinfo)
    }


@router.get("/debug/all-reviews")
async def debug_all_reviews(current_user: User = Depends(get_current_active_user)):
    from app.database import get_database
    db = get_database()
    all_reviews = await db.reviews.find().to_list(length=100)
    
    reviews_info = []
    for review in all_reviews:
        reviews_info.append({
            "id": str(review.get("_id")),
            "filename": review.get("filename"),
            "user_id": review.get("user_id"),
            "created_at": review.get("created_at")
        })
    
    return {
        "current_user_id": current_user.id,
        "current_username": current_user.username,
        "total_reviews_in_db": len(reviews_info),
        "reviews": reviews_info
    }

