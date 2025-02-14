if [ ! -d "venv" ]; then
    python3 -m venv venv
    source venv/bin/activate
    pip install -r backend/requirements.txt
    cd backend
    python main.py
else
    source venv/bin/activate
    cd backend 
    python main.py
fi
