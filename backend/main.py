from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import verifications
from backend.services.db import init_db_pool, close_db_pool, test_connection
import uvicorn
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Welocity BGC Backend",
    description="Internal API for Background Check Dashboard",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:3001", # Next.js frontend
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event - initialize database
@app.on_event("startup")
async def startup_event():
    logger.info("Application startup - Initializing database connection")
    try:
        init_db_pool()
        if test_connection():
            logger.info("Database connection successful")
        else:
            logger.error("Database connection test failed")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise

# Shutdown event - close database connections
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutdown - Closing database connections")
    close_db_pool()

# Include Routers
app.include_router(verifications.router, prefix="/api/verifications", tags=["Verifications"])

@app.get("/")
def health_check():
    return {"status": "ok", "service": "bgc-backend"}

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)

