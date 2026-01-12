import os
from typing import List, Dict, Optional
from datetime import datetime
from backend.schemas.verification import (
    VerificationDetail, UserInfo, StepsStatus, DeviceInfo, 
    NetworkDetails, DocumentImages, DocumentDetails, LivenessInfo, 
    FaceMatchInfo, PrivacyInfo, VerificationEvent, VerificationWebhook
)
from backend.services.db import get_db_connection, get_db_cursor, init_db_pool
import logging

logger = logging.getLogger(__name__)

class VerificationStore:
    def __init__(self):
        """Initialize the PostgreSQL-backed verification store."""
        self.storage_path = "backend/storage"
        os.makedirs(self.storage_path, exist_ok=True)
        
        # Initialize database connection pool
        try:
            init_db_pool()
            logger.info("Database connection pool initialized")
        except Exception as e:
            logger.error(f"Failed to initialize database: {e}")
            raise

    def _transform_multi_table_data_to_verification(self, session_data: dict, 
                                                     document_data: dict,
                                                     audit_events: list) -> VerificationDetail:
        """
        Transform data from all three tables (sessions, documents, audit_log) into VerificationDetail schema.
        
        Args:
            session_data: Data from the sessions table
            document_data: Data from the documents table
            audit_events: List of audit log events
        
        Returns:
            VerificationDetail object
        """
        session_id = session_data['id']
        doc_data = document_data.get('doc_data', {})
        
        # Extract user information - prioritize doc_data, fallback to session data
        name = doc_data.get('name', session_data.get('candidate_name', 'Unknown'))
        email = session_data.get('candidate_email', f"{candidate_name}@example.com")
        phone = session_data.get('candidate_phone')
        dob = doc_data.get('dob', '1990-01-01')
        gender = doc_data.get('gender', 'Unknown')
        
        # Extract address information
        address_data = doc_data.get('address', {})
        full_address = address_data.get('full_address', '')
        city = address_data.get('vtc', address_data.get('district', 'Unknown'))
        state = address_data.get('state', 'Unknown')
        country = address_data.get('country', 'India')
        pincode = address_data.get('pincode', '')
        
        # Extract document information
        doc_type = document_data.get('doc_type', 'unknown')
        doc_number = doc_data.get('aadhaar_number', 'XXXX-XXXX-XXXX')
        
        # Issuer information
        issuer_data = doc_data.get('issuer', {})
        issuer_name = issuer_data.get('name', 'Unknown Issuer')
        
        # Photo file
        photo_url = ""
        photo_file = document_data.get('photo_file') or doc_data.get('photo_file')
        if photo_file:
            photo_url = f"/api/files/{photo_file}"
        
        # Session status
        session_status = session_data.get('status', 'pending').upper()
        
        # Determine verification steps status based on session status and audit events
        has_document_fetch = any(e['event'] in ['DOCUMENT_FETCHED', 'STATUS_CHECKED'] for e in audit_events)
        
        steps_status = StepsStatus(
            document="APPROVED" if has_document_fetch and session_status == "VERIFIED" else "PENDING",
            selfie="APPROVED" if photo_file else "PENDING",
            database="APPROVED" if session_status == "VERIFIED" else "PENDING",
            risk="APPROVED" if session_status == "VERIFIED" else "PENDING"
        )
        
        # Map audit log to events
        events = []
        for audit in audit_events:
            event_type_map = {
                'SESSION_INITIATED': 'SESSION_START',
                'STATUS_CHECKED': 'DOCUMENT_FETCH',
                'DOCUMENT_FETCHED': 'DOCUMENT_RETRIEVED',
                'VERIFICATION_COMPLETE': 'VERIFICATION_COMPLETE'
            }
            
            event_type = event_type_map.get(audit['event'], audit['event'])
            
            # Create event description
            if audit['event'] == 'SESSION_INITIATED':
                description = f"Verification session initiated for {', '.join(audit.get('details', {}).get('requestedDocs', []))}"
                title = "Session Started"
            elif audit['event'] == 'STATUS_CHECKED':
                status = audit.get('details', {}).get('status', 'unknown')
                description = f"Document status checked: {status}"
                title = "Status Check"
            elif audit['event'] == 'DOCUMENT_FETCHED':
                description = "Document retrieved successfully"
                title = "Document Retrieved"
            else:
                description = f"Event: {audit['event']}"
                title = audit['event'].replace('_', ' ').title()
            
            events.append(VerificationEvent(
                id=f"evt_{session_id}_{audit['id']}",
                type=event_type,
                title=title,
                description=description,
                timestamp=audit['created_at'].isoformat() if audit['created_at'] else None,
                thumbnails=[],
                metadata={
                    "ip_address": audit.get('ip_address'),
                    "user_agent": audit.get('user_agent'),
                    **audit.get('details', {})
                }
            ))
        
        # Extract device info from audit logs (first event)
        first_event = audit_events[0] if audit_events else {}
        ip_address = first_event.get('ip_address', document_data.get('fetched_ip', 'Unknown'))
        user_agent = first_event.get('user_agent', 'Unknown')
        
        # Parse user agent to extract device info (simplified)
        device_type = "Mobile" if "Mobile" in user_agent else "Desktop"
        os_info = "Unknown"
        browser_info = "Unknown"
        
        if "Macintosh" in user_agent:
            os_info = "macOS"
        elif "Windows" in user_agent:
            os_info = "Windows"
        elif "Linux" in user_agent:
            os_info = "Linux"
            
        if "Chrome" in user_agent:
            browser_info = "Chrome"
        elif "Safari" in user_agent and "Chrome" not in user_agent:
            browser_info = "Safari"
        elif "Firefox" in user_agent:
            browser_info = "Firefox"
        
        # Create verification detail object
        verification = VerificationDetail(
            id=f"#{session_id}",
            user=UserInfo(
                name=name,
                email=email if email else f"{session_id}@example.com",
                country=country,
                documentType=doc_type.upper(),
                phone=phone,
                avatarUrl=photo_url
            ),
            status=session_status,
            createdAt=session_data['created_at'].isoformat() if session_data.get('created_at') else None,
            vendor=issuer_name,
            steps=steps_status,
            device=DeviceInfo(
                type=device_type,
                os=os_info,
                browser=browser_info,
                ip=ip_address,
                location=f"{city}, {state}, {country}"
            ),
            network=NetworkDetails(
                ip=ip_address,
                location=f"{city}, {state}, {country}",
                city=city,
                country=country,
                isp="Unknown",
                timezone="Asia/Kolkata",
                privacy=PrivacyInfo(
                    status="CLEAN",
                    vpn=False,
                    tor=False,
                    proxy=False,
                    dataCenter=False
                ),
                distanceFromDoc=0.0
            ),
            devices=[],
            warnings=[],
            documents=DocumentImages(
                front="https://placehold.co/600x400/e2e8f0/475569?text=Aadhaar+Front",
                back="https://placehold.co/600x400/e2e8f0/475569?text=Aadhaar+Back",
                details=DocumentDetails(
                    firstName=name.split()[0] if name else "Unknown",
                    lastName=" ".join(name.split()[1:]) if len(name.split()) > 1 else "",
                    dob=dob,
                    docNumber=doc_number,
                    expiryDate="N/A"  # Aadhaar doesn't have expiry
                )
            ),
            liveness=LivenessInfo(
                score=98 if photo_file else 0,
                status="PASS" if photo_file else "PENDING",
                selfieUrl=photo_url
            ),
            faceMatch=FaceMatchInfo(
                score=95 if photo_file else 0,
                status="MATCH" if photo_file else "PENDING"
            ),
            events=sorted(events, key=lambda e: e.timestamp if e.timestamp else ""),
        )
        
        return verification

    def add_verification(self, verification: VerificationDetail):
        """
        Add or update a verification in the database.
        This would insert into the documents table.
        """
        # For now, this is a placeholder - in a real scenario, you would insert/update the database
        logger.info(f"Would add/update verification: {verification.id}")
        pass

    def get_all(self) -> List[VerificationDetail]:
        """Get all verification sessions from the database, joining all three tables."""
        verifications = []
        
        try:
            with get_db_connection() as conn:
                with get_db_cursor(conn) as cur:
                    # Query to join sessions, documents, and get session_id for audit logs
                    cur.execute("""
                        SELECT 
                            s.id,
                            s.candidate_name,
                            s.candidate_email,
                            s.candidate_phone,
                            s.status,
                            s.requested_docs,
                            s.created_at,
                            s.updated_at,
                            d.id as doc_id,
                            d.doc_type,
                            d.doc_data,
                            d.photo_file,
                            d.pdf_file,
                            d.fetched_at,
                            d.fetched_ip
                        FROM sessions s
                        LEFT JOIN documents d ON s.id = d.session_id
                        ORDER BY s.created_at DESC;
                    """)
                    
                    sessions_docs = cur.fetchall()
                    
                    for row in sessions_docs:
                        # Get audit logs for this session
                        cur.execute("""
                            SELECT id, session_id, event, details, ip_address, user_agent, created_at
                            FROM audit_log
                            WHERE session_id = %s
                            ORDER BY created_at ASC;
                        """, (row['id'],))
                        
                        audit_events = cur.fetchall()
                        
                        # Transform to VerificationDetail
                        session_data = {
                            'id': row['id'],
                            'candidate_name': row['candidate_name'],
                            'candidate_email': row['candidate_email'],
                            'candidate_phone': row['candidate_phone'],
                            'status': row['status'],
                            'requested_docs': row['requested_docs'],
                            'created_at': row['created_at'],
                            'updated_at': row['updated_at']
                        }
                        
                        document_data = {
                            'doc_type': row.get('doc_type'),
                            'doc_data': row.get('doc_data'),
                            'photo_file': row.get('photo_file'),
                            'pdf_file': row.get('pdf_file'),
                            'fetched_at': row.get('fetched_at'),
                            'fetched_ip': row.get('fetched_ip')
                        }
                        
                        if document_data['doc_data']:  # Only process if we have document data
                            verification = self._transform_multi_table_data_to_verification(
                                session_data=session_data,
                                document_data=document_data,
                                audit_events=audit_events
                            )
                            verifications.append(verification)
                    
                    logger.info(f"Retrieved {len(verifications)} verifications from database (joined from all 3 tables)")
                    
        except Exception as e:
            logger.error(f"Error retrieving verifications: {e}")
            raise
        
        return verifications

    def get_by_id(self, session_id: str) -> Optional[VerificationDetail]:
        """Get a specific verification session by ID, joining all three tables."""
        # Remove '#' prefix if present
        clean_session_id = session_id.replace('#', '')
        
        try:
            with get_db_connection() as conn:
                with get_db_cursor(conn) as cur:
                    # Query to join sessions and documents
                    cur.execute("""
                        SELECT 
                            s.id,
                            s.candidate_name,
                            s.candidate_email,
                            s.candidate_phone,
                            s.status,
                            s.requested_docs,
                            s.created_at,
                            s.updated_at,
                            d.id as doc_id,
                            d.doc_type,
                            d.doc_data,
                            d.photo_file,
                            d.pdf_file,
                            d.fetched_at,
                            d.fetched_ip
                        FROM sessions s
                        LEFT JOIN documents d ON s.id = d.session_id
                        WHERE s.id = %s
                        LIMIT 1;
                    """, (clean_session_id,))
                    
                    row = cur.fetchone()
                    
                    if row:
                        # Get audit logs for this session
                        cur.execute("""
                            SELECT id, session_id, event, details, ip_address, user_agent, created_at
                            FROM audit_log
                            WHERE session_id = %s
                            ORDER BY created_at ASC;
                        """, (clean_session_id,))
                        
                        audit_events = cur.fetchall()
                        
                        # Transform to VerificationDetail
                        session_data = {
                            'id': row['id'],
                            'candidate_name': row['candidate_name'],
                            'candidate_email': row['candidate_email'],
                            'candidate_phone': row['candidate_phone'],
                            'status': row['status'],
                            'requested_docs': row['requested_docs'],
                            'created_at': row['created_at'],
                            'updated_at': row['updated_at']
                        }
                        
                        document_data = {
                            'doc_type': row.get('doc_type'),
                            'doc_data': row.get('doc_data'),
                            'photo_file': row.get('photo_file'),
                            'pdf_file': row.get('pdf_file'),
                            'fetched_at': row.get('fetched_at'),
                            'fetched_ip': row.get('fetched_ip')
                        }
                        
                        if document_data['doc_data']:
                            verification = self._transform_multi_table_data_to_verification(
                                session_data=session_data,
                                document_data=document_data,
                                audit_events=audit_events
                            )
                            logger.info(f"Retrieved verification for session: {session_id} (joined from all 3 tables)")
                            return verification
                        else:
                            logger.warning(f"No document data found for session: {session_id}")
                            return None
                    else:
                        logger.warning(f"No verification found for session: {session_id}")
                        return None
                        
        except Exception as e:
            logger.error(f"Error retrieving verification {session_id}: {e}")
            raise

    async def save_file(self, session_id: str, file_name: str, file_content: bytes) -> str:
        """Save a file to the filesystem."""
        # Sanitize session_id for filename
        safe_session_id = session_id.replace('#', '')
        file_path = os.path.join(self.storage_path, f"{safe_session_id}_{file_name}")
        
        with open(file_path, "wb") as f:
            f.write(file_content)
            
        # Return a relative URL
        return f"/api/files/{safe_session_id}_{file_name}"

# Create a singleton instance
db = VerificationStore()
