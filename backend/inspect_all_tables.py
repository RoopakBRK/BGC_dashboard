"""
Inspect all three tables (sessions, documents, audit_log) to understand their structure and relationships.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from services.db import init_db_pool, get_db_connection, get_db_cursor
import json

def inspect_table(cur, table_name):
    """Inspect a single table's schema and sample data."""
    print(f"\n{'='*60}")
    print(f"TABLE: {table_name}")
    print('='*60)
    
    # Get schema
    print(f"\n--- Schema ---")
    cur.execute("""
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = %s
        ORDER BY ordinal_position;
    """, (table_name,))
    columns = cur.fetchall()
    
    for col in columns:
        default = col['column_default'][:30] if col['column_default'] else 'NULL'
        print(f"  {col['column_name']:25} {col['data_type']:20} nullable={col['is_nullable']:3} default={default}")
    
    # Get count
    cur.execute(f"SELECT COUNT(*) as count FROM {table_name};")
    count = cur.fetchone()['count']
    print(f"\n--- Row Count: {count} ---")
    
    # Get sample data
    if count > 0:
        print(f"\n--- Sample Data (first 2 records) ---")
        cur.execute(f"SELECT * FROM {table_name} LIMIT 2;")
        samples = cur.fetchall()
        
        for i, sample in enumerate(samples, 1):
            print(f"\nRecord {i}:")
            for key, value in sample.items():
                if isinstance(value, dict):
                    print(f"  {key}: {json.dumps(value, indent=4)}")
                else:
                    print(f"  {key}: {value}")

def inspect_relationships(cur):
    """Check for foreign key relationships."""
    print(f"\n{'='*60}")
    print("TABLE RELATIONSHIPS")
    print('='*60)
    
    cur.execute("""
        SELECT
            tc.table_name, 
            kcu.column_name, 
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name 
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name IN ('sessions', 'documents', 'audit_log');
    """)
    
    relationships = cur.fetchall()
    if relationships:
        for rel in relationships:
            print(f"  {rel['table_name']}.{rel['column_name']} -> {rel['foreign_table_name']}.{rel['foreign_column_name']}")
    else:
        print("  No foreign key constraints found")
        print("  (Checking for common column names to infer relationships...)")
        
        # Check for session_id columns
        cur.execute("""
            SELECT table_name, column_name
            FROM information_schema.columns
            WHERE table_name IN ('sessions', 'documents', 'audit_log')
            AND column_name LIKE '%session%'
            ORDER BY table_name;
        """)
        session_cols = cur.fetchall()
        if session_cols:
            print("\n  Tables with session-related columns:")
            for col in session_cols:
                print(f"    {col['table_name']}.{col['column_name']}")

def main():
    print("Inspecting all database tables...")
    init_db_pool()
    
    with get_db_connection() as conn:
        with get_db_cursor(conn) as cur:
            inspect_table(cur, 'sessions')
            inspect_table(cur, 'documents')
            inspect_table(cur, 'audit_log')
            inspect_relationships(cur)

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
