# create_tables.py
from app.database import init_db

if __name__ == "__main__":
    init_db()
    print("Tables created!")