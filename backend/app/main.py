from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.routes import review, auth
import json

app = FastAPI(
    title="Refyn API",
    description="AI-powered code review platform using Groq LLM",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(review.router)
app.include_router(auth.router)

# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    if request.url.path.startswith("/api/auth"):
        body = await request.body()
        print(f"Request to {request.url.path}: {body.decode() if body else 'No body'}")
    
    response = await call_next(request)
    return response


@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    print("🚀 Refyn API is running!")


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()


@app.get("/")
async def root():
    return {
        "message": "Refyn API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

