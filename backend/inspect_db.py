"""
Quick script to inspect the PostgreSQL database schema and sample data.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from services.db import init_db_pool, get_db_connection, get_db_cursor
import json

def inspect_database():
    """Inspect the database schema and sample data."""
    print("Initializing database connection...")
    init_db_pool()
    
    with get_db_connection() as conn:
        with get_db_cursor(conn) as cur:
            # Check if documents table exists
            print("\n=== Checking for 'documents' table ===")
            cur.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name IN ('documents', 'sessions', 'audit_log')
                ORDER BY table_name;
            """)
            tables = cur.fetchall()
            print(f"Found tables: {[t['table_name'] for t in tables]}")
            
            # Get documents table schema
            print("\n=== Documents table schema ===")
            cur.execute("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = 'documents'
                ORDER BY ordinal_position;
            """)
            columns = cur.fetchall()
            for col in columns:
                print(f"  {col['column_name']:20} {col['data_type']:15} nullable={col['is_nullable']}")
            
            # Count documents
            print("\n=== Document count ===")
            cur.execute("SELECT COUNT(*) as count FROM documents;")
            count = cur.fetchone()
            print(f"Total documents: {count['count']}")
            
            # Get sample doc_data
            if count['count'] > 0:
                print("\n=== Sample doc_data (first 3 records) ===")
                cur.execute("""
                    SELECT session_id, doc_data 
                    FROM documents 
                    LIMIT 3;
                """)
                samples = cur.fetchall()
                for i, sample in enumerate(samples, 1):
                    print(f"\n--- Sample {i} ---")
                    print(f"Session ID: {sample['session_id']}")
                    print(f"Doc Data Structure:")
                    if sample['doc_data']:
                        print(json.dumps(sample['doc_data'], indent=2))
                    else:
                        print("  (NULL)")
            else:
                print("No documents found in the database.")

if __name__ == "__main__":
    try:
        inspect_database()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
