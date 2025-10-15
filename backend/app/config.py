from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    mongodb_uri: str = "mongodb://localhost:27017/code_review"
    groq_api_key: str
    cors_origins: str = "http://localhost:3000"
    max_file_size: int = 10485760  # 10MB in bytes
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()

