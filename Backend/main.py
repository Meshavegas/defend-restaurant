import logging
import sys
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.base_class import init_db, Base, engine

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

try:
    from app.api.v1.api import api_router
    from app.core.config import settings
except ImportError as e:
    logger.error(f"Failed to import required modules: {e}")
    sys.exit(1)

def create_application() -> FastAPI:
    try:
        _app = FastAPI(
            title="Restaurant API",
            description="Backend API for Restaurant Management System",
            version="1.0.0"
        )

        # Configure CORS
        _app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        # Include API router
        _app.include_router(api_router, prefix="/api/v1")


        return _app
    except Exception as e:
        logger.error(f"Failed to create application: {e}")
        raise

app = create_application()


Base.metadata.create_all(bind=engine)


@app.get("/")
async def root():
    return {"message": "Welcome to Restaurant API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    try:
        
        logger.info("Starting the application...")
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        logger.error(f"Failed to start application: {e}")
        sys.exit(1)