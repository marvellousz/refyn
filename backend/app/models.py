from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone
from enum import Enum


class SeverityLevel(str, Enum):
    CRITICAL = "critical"
    WARNING = "warning"
    SUGGESTION = "suggestion"
    INFO = "info"


class CodeIssue(BaseModel):
    line: Optional[int] = None
    severity: SeverityLevel
    category: str  # e.g., "readability", "performance", "security"
    description: str
    suggestion: Optional[str] = None


class ReviewAnalysis(BaseModel):
    readability_score: int = Field(..., ge=1, le=10, description="Score from 1-10")
    modularity_score: int = Field(..., ge=1, le=10, description="Score from 1-10")
    maintainability_score: int = Field(..., ge=1, le=10, description="Score from 1-10")
    overall_summary: str
    strengths: List[str]
    issues: List[CodeIssue]
    suggestions: List[str]
    potential_bugs: List[str]
    security_concerns: List[str]


class CodeReview(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    filename: str
    language: str
    file_size: int
    lines_of_code: int
    analysis: ReviewAnalysis
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    user_id: Optional[str] = None
    
    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}


class ReviewResponse(BaseModel):
    id: str
    filename: str
    language: str
    analysis: ReviewAnalysis
    created_at: datetime
    user_id: Optional[str] = None


class StatsResponse(BaseModel):
    total_reviews: int
    languages: dict
    avg_readability: float
    avg_modularity: float
    avg_maintainability: float
    recent_reviews: List[ReviewResponse]


# User Models
class User(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    email: EmailStr
    username: str
    hashed_password: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}


class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_length=72)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., max_length=72)


class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    is_active: bool
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None

