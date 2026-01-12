import os
import psycopg2
from psycopg2 import pool
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from dotenv import load_dotenv
import logging

# Load environment variables from .env file
load_dotenv()

logger = logging.getLogger(__name__)

# Database configuration from environment variables
DB_CONFIG = {
    'host': os.getenv('POSTGRES_HOST', 'localhost'),
    'port': int(os.getenv('POSTGRES_PORT', 5432)),
    'database': os.getenv('POSTGRES_DB', 'diditdashboard'),
    'user': os.getenv('POSTGRES_USER', 'postgres'),
    'password': os.getenv('POSTGRES_PASSWORD', '')
}

# Connection pool
connection_pool = None

def init_db_pool(minconn=1, maxconn=10):
    """Initialize the database connection pool."""
    global connection_pool
    try:
        connection_pool = psycopg2.pool.SimpleConnectionPool(
            minconn,
            maxconn,
            **DB_CONFIG
        )
        logger.info("Database connection pool created successfully")
        return True
    except Exception as e:
        logger.error(f"Error creating connection pool: {e}")
        raise

def close_db_pool():
    """Close all connections in the pool."""
    global connection_pool
    if connection_pool:
        connection_pool.closeall()
        logger.info("Database connection pool closed")

@contextmanager
def get_db_connection():
    """Context manager for database connections."""
    conn = None
    try:
        conn = connection_pool.getconn()
        yield conn
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        logger.error(f"Database error: {e}")
        raise
    finally:
        if conn:
            connection_pool.putconn(conn)

def get_db_cursor(conn, cursor_factory=RealDictCursor):
    """Get a cursor from a connection."""
    return conn.cursor(cursor_factory=cursor_factory)

def test_connection():
    """Test database connection."""
    try:
        with get_db_connection() as conn:
            with get_db_cursor(conn) as cur:
                cur.execute("SELECT version();")
                version = cur.fetchone()
                logger.info(f"PostgreSQL version: {version}")
                return True
    except Exception as e:
        logger.error(f"Connection test failed: {e}")
        return False
