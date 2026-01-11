from typing import List, Optional, Dict, Any
from pydantic import BaseModel

# --- Ingestion Schemas ---

class UserIngest(BaseModel):
    name: str
    country: str
    email: Optional[str] = None
    phone: Optional[str] = None

class VerificationIngest(BaseModel):
    session_id: str
    user: UserIngest
    document_type: str
    workflow: List[str]
    status: str
    timestamps: Dict[str, str]
    vendor: Optional[str] = None

# --- Response Schemas (Matching Frontend Types) ---

class UserInfo(BaseModel):
    name: str
    avatarUrl: Optional[str] = None
    email: str
    phone: Optional[str] = None
    country: str
    documentType: str

class StepsStatus(BaseModel):
    document: str
    selfie: str
    database: str
    risk: str

class VerificationSession(BaseModel):
    id: str
    user: UserInfo
    status: str
    createdAt: str
    vendor: Optional[str] = None
    steps: StepsStatus

class DocumentDetails(BaseModel):
    firstName: str
    lastName: str
    dob: str
    docNumber: str
    expiryDate: str

class DocumentImages(BaseModel):
    front: str
    back: str
    details: DocumentDetails

class LivenessInfo(BaseModel):
    score: int
    status: str
    selfieUrl: str

class FaceMatchInfo(BaseModel):
    score: int
    status: str

class DeviceInfo(BaseModel):
    type: str
    os: str
    browser: str
    ip: str
    location: str

class PrivacyInfo(BaseModel):
    status: str
    vpn: bool
    tor: bool
    proxy: bool
    dataCenter: bool

class NetworkDetails(BaseModel):
    ip: str
    location: str
    city: str
    country: str
    isp: str
    timezone: str
    privacy: PrivacyInfo
    distanceFromDoc: float

class DeviceItem(BaseModel):
    id: str
    ip: str
    platform: str
    brand: Optional[str] = None
    model: Optional[str] = None
    os: str
    browser: str
    isp: str
    timezone: str
    distanceMatch: bool
    privacy: Dict[str, bool]

class VerificationEvent(BaseModel):
    id: str
    type: str
    title: str
    description: str
    timestamp: str
    thumbnails: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None

class VerificationWebhook(BaseModel):
    id: str
    event: str
    status: int
    timestamp: str
    payload: Dict[str, Any]
    response: Dict[str, Any]

class VerificationDetail(VerificationSession):
    device: DeviceInfo
    network: NetworkDetails
    devices: List[DeviceItem]
    warnings: List[str]
    documents: DocumentImages
    liveness: LivenessInfo
    faceMatch: FaceMatchInfo
    events: List[VerificationEvent]
    webhooks: List[VerificationWebhook]
