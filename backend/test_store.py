"""
Test script to verify multi-table integration and event extraction.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from backend.services.store import db
import json

def test_multi_table():
    """Test the multi-table integration."""
    print("Testing Multi-Table Integration (sessions + documents + audit_log)...\n")
    
    # Test get_all
    print("=== Testing get_all() with multi-table join ===")
    all_verifications = db.get_all()
    print(f"Found {len(all_verifications)} verifications")
    
    if all_verifications:
        v = all_verifications[0]
        print(f"\n📋 Session: {v.id}")
        print(f"   User: {v.user.name}")
        print(f"   Email: {v.user.email}")
        print(f"   Phone: {v.user.phone}")
        print(f"   Status: {v.status}")
        print(f"   Document Type: {v.user.documentType}")
        print(f"   Created: {v.createdAt}")
        print(f"\n📱 Device Info:")
        print(f"   Type: {v.device.type}")
        print(f"   OS: {v.device.os}")
        print(f"   Browser: {v.device.browser}")
        print(f"   IP: {v.device.ip}")
        print(f"\n✅ Verification Steps:")
        print(f"   Document: {v.steps.document}")
        print(f"   Selfie: {v.steps.selfie}")
        print(f"   Database: {v.steps.database}")
        print(f"   Risk: {v.steps.risk}")
        print(f"\n📅 Events from audit_log ({len(v.events)} events):")
        for event in v.events:
            print(f"   • {event.timestamp}: {event.title}")
            print(f"     {event.description}")
            if event.metadata:
                print(f"     Metadata: {event.metadata}")

        
        # Test get_by_id with detailed output
        print("\n=== Testing get_by_id() ===")
        test_id = v.id.replace('#', '')
        verification = db.get_by_id(test_id)
        
        if verification:
            print(f"✅ Successfully retrieved detailed verification")
            print(f"   Events count: {len(verification.events)}")
            print(f"   First event: {verification.events[0].title if verification.events else 'No events'}")
            print(f"   Last event: {verification.events[-1].title if verification.events else 'No events'}")
        else:
            print("❌ Failed to retrieve verification by ID")
    else:
        print("No verifications found")

if __name__ == "__main__":
    try:
        test_multi_table()
        print("\n✅ Multi-table integration test completed successfully!")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
