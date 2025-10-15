from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer
from app.models import UserCreate, UserLogin, UserResponse, Token
from app.auth import (
    get_password_hash, 
    authenticate_user, 
    create_access_token, 
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    timedelta
)
from app.database import get_database
from datetime import timedelta, datetime, timezone
from typing import List

router = APIRouter(prefix="/api/auth", tags=["authentication"])
security = HTTPBearer()

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    """Register a new user."""
    try:
        print(f"Registration attempt for email: {user_data.email}, username: {user_data.username}")
        print(f"Email type: {type(user_data.email)}, Username type: {type(user_data.username)}")
        print(f"Password length: {len(user_data.password)}")
        db = get_database()
        
        # Check if user already exists
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            print(f"Email already exists: {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if username already exists
        existing_username = await db.users.find_one({"username": user_data.username})
        if existing_username:
            print(f"Username already exists: {user_data.username}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Create new user
        print("Creating password hash...")
        hashed_password = get_password_hash(user_data.password)
        print("Password hash created successfully")
        
        user_dict = {
            "email": user_data.email,
            "username": user_data.username,
            "hashed_password": hashed_password,
            "is_active": True,
            "created_at": datetime.now(timezone.utc)
        }
        
        print("Inserting user into database...")
        result = await db.users.insert_one(user_dict)
        user_dict["id"] = str(result.inserted_id)
        print(f"User created successfully with ID: {user_dict['id']}")
        
        # Return user without password
        return UserResponse(
            id=user_dict["id"],
            email=user_dict["email"],
            username=user_dict["username"],
            is_active=user_dict["is_active"],
            created_at=user_dict["created_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Login a user and return access token."""
    user = await authenticate_user(user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: UserResponse = Depends(get_current_active_user)):
    """Get current user information."""
    return current_user

@router.get("/users", response_model=List[UserResponse])
async def read_users(current_user: UserResponse = Depends(get_current_active_user)):
    """Get all users (admin only - for now, all authenticated users)."""
    db = get_database()
    users = []
    async for user_data in db.users.find():
        user_data["id"] = str(user_data["_id"])
        users.append(UserResponse(
            id=user_data["id"],
            email=user_data["email"],
            username=user_data["username"],
            is_active=user_data["is_active"],
            created_at=user_data.get("created_at")
        ))
    return users
