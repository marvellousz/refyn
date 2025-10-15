from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings
import asyncio

client: AsyncIOMotorClient = None
db: AsyncIOMotorDatabase = None


async def connect_to_mongo():
    global client, db
    try:
        print(f"🔄 Attempting to connect to MongoDB...")
        client = AsyncIOMotorClient(
            settings.mongodb_uri,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000
        )
        # Test the connection
        await client.admin.command('ping')
        db = client.code_review  # Explicitly use 'code_review' database
        print("✅ Connected to MongoDB")
    except Exception as e:
        print(f"⚠️  MongoDB connection failed: {e}")
        print("⚠️  Application will continue without database")
        print("⚠️  Please check your MongoDB Atlas cluster and connection string")
        client = None
        db = None


async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("❌ Closed MongoDB connection")


def get_database() -> AsyncIOMotorDatabase:
    if db is None:
        raise Exception("Database not connected. Please check MongoDB configuration.")
    return db

