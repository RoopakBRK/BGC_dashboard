from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import List, Optional
import json
from backend.schemas.verification import (
    VerificationDetail, VerificationIngest, VerificationSession,
    UserIngest, UserInfo, StepsStatus, DeviceInfo, NetworkDetails,
    DocumentImages, DocumentDetails, LivenessInfo, FaceMatchInfo, PrivacyInfo
)
from backend.services.store import db

router = APIRouter()

@router.get("/", response_model=List[VerificationSession])
def get_verifications():
    """Get all verification sessions (summary view)."""
    # We return the full objects, but the response_model will filter to VerificationSession fields
    return db.get_all()

@router.get("/{session_id}", response_model=VerificationDetail)
def get_verification_detail(session_id: str):
    """Get full details for a specific verification session."""
    verification = db.get_by_id(session_id)
    if not verification:
        raise HTTPException(status_code=404, detail="Verification session not found")
    return verification

@router.post("/ingest", status_code=status.HTTP_201_CREATED)
async def ingest_verification(
    metadata: str = Form(...),
    files: List[UploadFile] = File(default=[])
):
    """
    Ingest a new verification session.
    - metadata: JSON string conforming to VerificationIngest schema (conceptually, though we'll parse it to a richer internal model for simplicity)
    - files: List of PDF/Image files
    """
    try:
        data = json.loads(metadata)
        # In a real scenario, we would validate 'data' against VerificationIngest
        # ingest_data = VerificationIngest(**data) 
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON metadata")

    session_id = data.get("session_id", "unknown")
    if not session_id.startswith("#"):
        session_id = f"#{session_id}"

    # Handle files
    saved_files = []
    for file in files:
        content = await file.read()
        file_url = await db.save_file(session_id, file.filename, content)
        saved_files.append(file_url)

    # Transform Ingest Data to VerificationDetail (Mocking the enrichment process)
    # Since the ingest payload is simple, we generate the detailed fields mock-style
    
    user_data = data.get("user", {})
    
    new_verification = VerificationDetail(
        id=session_id,
        user=UserInfo(
            name=user_data.get("name", "Unknown"),
            email=user_data.get("email", "unknown@example.com"),
            country=user_data.get("country", "Unknown"),
            documentType=data.get("document_type", "Unknown"),
            phone=user_data.get("phone", None),
            avatarUrl=""
        ),
        status=data.get("status", "NOT_STARTED").upper(),
        createdAt=data.get("timestamps", {}).get("created_at", "2024-01-01T00:00:00Z"),
        vendor="Veriff", # Hardcoded for prototype
        steps=StepsStatus(
            document="APPROVED" if "ID_VERIFICATION" in data.get("workflow", []) else "PENDING",
            selfie="APPROVED" if "LIVENESS" in data.get("workflow", []) else "PENDING",
            database="APPROVED",
            risk="APPROVED"
        ),
        device=DeviceInfo(
            type="Mobile",
            os="iOS 17",
            browser="Mobile Safari",
            ip="49.37.170.8",
            location="Bengaluru, India"
        ),
        network=NetworkDetails(
            ip="49.37.170.8",
            location="Bengaluru, Karnataka, India",
            city="Bengaluru",
            country="India",
            isp="Bharti Airtel Ltd.",
            timezone="Asia/Kolkata",
            privacy=PrivacyInfo(
                status="CLEAN",
                vpn=False,
                tor=False,
                proxy=False,
                dataCenter=False
            ),
            distanceFromDoc=783.64
        ),
        devices=[], # Can be populated if provided in ingest
        warnings=[],
        documents=DocumentImages(
            front="https://placehold.co/600x400/e2e8f0/475569?text=ID+Front", # Mock
            back="https://placehold.co/600x400/e2e8f0/475569?text=ID+Back",   # Mock
            details=DocumentDetails(
                firstName=user_data.get("name", "Unknown").split(" ")[0],
                lastName=user_data.get("name", "Unknown").split(" ")[-1],
                dob="1995-01-01",
                docNumber="ABC12345",
                expiryDate="2030-01-01"
            )
        ),
        liveness=LivenessInfo(
            score=98,
            status="PASS",
            selfieUrl="https://placehold.co/400x400/e2e8f0/475569?text=Selfie"
        ),
        faceMatch=FaceMatchInfo(
            score=95,
            status="MATCH"
        ),
        events=[],
        webhooks=[]
    )

    db.add_verification(new_verification)
    
    return {"message": "Verification session created", "session_id": session_id}
