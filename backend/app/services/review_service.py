from app.database import get_database
from app.models import CodeReview, ReviewAnalysis, ReviewResponse
from app.services.llm_service import LLMService
from app.utils.code_chunker import CodeChunker
from app.utils.language_detector import detect_language
from bson import ObjectId
from typing import List, Optional
from datetime import datetime, timezone


class ReviewService:
    def __init__(self):
        self.llm_service = LLMService()
        self.chunker = CodeChunker(max_chunk_size=3000)
    
    async def create_review(self, filename: str, content: str, file_size: int, user_id: str = None) -> CodeReview:
        language = detect_language(filename)
        lines_of_code = len(content.split('\n'))
        chunks = self.chunker.chunk_code(content, language)
        analysis = await self.llm_service.analyze_code(content, language, chunks)
        
        review = CodeReview(
            filename=filename,
            language=language,
            file_size=file_size,
            lines_of_code=lines_of_code,
            analysis=analysis,
            created_at=datetime.now(timezone.utc),
            user_id=user_id
        )
        
        db = get_database()
        result = await db.reviews.insert_one(review.model_dump(by_alias=True, exclude={'id'}))
        review.id = str(result.inserted_id)
        
        return review
    
    async def get_review(self, review_id: str) -> Optional[CodeReview]:
        db = get_database()
        review_data = await db.reviews.find_one({"_id": ObjectId(review_id)})
        
        if review_data:
            review_data['id'] = str(review_data['_id'])
            del review_data['_id']
            return CodeReview(**review_data)
        return None
    
    async def list_reviews(self, limit: int = 50, skip: int = 0, user_id: str = None) -> List[ReviewResponse]:
        db = get_database()
        query = {}
        if user_id:
            query["user_id"] = user_id
        cursor = db.reviews.find(query).sort("created_at", -1).skip(skip).limit(limit)
        reviews = await cursor.to_list(length=limit)
        
        result = []
        for review_data in reviews:
            review_data['id'] = str(review_data['_id'])
            del review_data['_id']
            review = CodeReview(**review_data)
            result.append(ReviewResponse(
                id=review.id,
                filename=review.filename,
                language=review.language,
                analysis=review.analysis,
                created_at=review.created_at
            ))
        
        return result
    
    async def get_stats(self, user_id: str = None):
        db = get_database()
        
        query = {}
        if user_id:
            query["user_id"] = user_id
        
        total_reviews = await db.reviews.count_documents(query)
        
        pipeline = []
        if user_id:
            pipeline.append({"$match": {"user_id": user_id}})
        pipeline.append({"$group": {"_id": "$language", "count": {"$sum": 1}}})
        
        lang_cursor = db.reviews.aggregate(pipeline)
        languages = {doc['_id']: doc['count'] async for doc in lang_cursor}
        
        score_pipeline = []
        if user_id:
            score_pipeline.append({"$match": {"user_id": user_id}})
        score_pipeline.append({
            "$group": {
                "_id": None,
                "avg_readability": {"$avg": "$analysis.readability_score"},
                "avg_modularity": {"$avg": "$analysis.modularity_score"},
                "avg_maintainability": {"$avg": "$analysis.maintainability_score"}
            }
        })
        
        score_cursor = db.reviews.aggregate(score_pipeline)
        scores = await score_cursor.to_list(length=1)
        
        avg_scores = scores[0] if scores else {
            "avg_readability": 0,
            "avg_modularity": 0,
            "avg_maintainability": 0
        }
        
        recent = await self.list_reviews(limit=5, user_id=user_id)
        
        return {
            "total_reviews": total_reviews,
            "languages": languages,
            "avg_readability": round(avg_scores.get("avg_readability", 0), 1),
            "avg_modularity": round(avg_scores.get("avg_modularity", 0), 1),
            "avg_maintainability": round(avg_scores.get("avg_maintainability", 0), 1),
            "recent_reviews": recent
        }

