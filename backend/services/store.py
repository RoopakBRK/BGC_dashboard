import os
import json
from typing import List, Dict, Optional
from backend.schemas.verification import VerificationDetail

# Mock data store
class VerificationStore:
    def __init__(self):
        self.verifications: Dict[str, VerificationDetail] = {}
        self.storage_path = "backend/storage"
        os.makedirs(self.storage_path, exist_ok=True)
        self._seed_mock_data()

    def _seed_mock_data(self):
        # We can optionally seed data here if needed, but for now we start empty
        # or load from a JSON file if we wanted persistence between restarts.
        pass

    def add_verification(self, verification: VerificationDetail):
        self.verifications[verification.id] = verification

    def get_all(self) -> List[VerificationDetail]:
        return list(self.verifications.values())

    def get_by_id(self, session_id: str) -> Optional[VerificationDetail]:
        # Handle both '#123' and '123' formats
        if not session_id.startswith('#'):
            session_id = f"#{session_id}"
        return self.verifications.get(session_id)

    async def save_file(self, session_id: str, file_name: str, file_content: bytes) -> str:
        # Sanitize session_id for filename
        safe_session_id = session_id.replace('#', '')
        file_path = os.path.join(self.storage_path, f"{safe_session_id}_{file_name}")
        
        with open(file_path, "wb") as f:
            f.write(file_content)
            
        # Return a relative URL or path (In a real app, this would be an S3 URL)
        # For this prototype, we'll return a fake URL that the frontend might use if we served static files
        return f"/api/files/{safe_session_id}_{file_name}"

db = VerificationStore()
