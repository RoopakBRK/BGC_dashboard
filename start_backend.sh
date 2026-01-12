#!/bin/bash
# Start the backend server
# This script should be run from the BGC_dashboard directory

cd "$(dirname "$0")"
source .venv/bin/activate
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
