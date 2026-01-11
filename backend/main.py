from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import verifications
import uvicorn

app = FastAPI(
    title="Welocity BGC Backend",
    description="Internal API for Background Check Dashboard",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:3000", # Next.js frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(verifications.router, prefix="/api/verifications", tags=["Verifications"])

@app.get("/")
def health_check():
    return {"status": "ok", "service": "bgc-backend"}

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
