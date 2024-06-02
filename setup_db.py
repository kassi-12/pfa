import sqlite3
import os

def create_db():
    db_dir = os.path.join(os.path.dirname(__file__), 'web', 'database')
    os.makedirs(db_dir, exist_ok=True)
    
    db_path = os.path.join(db_dir, 'users.db')
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            first_name TEXT,
            last_name TEXT,
            gender TEXT,
            phone TEXT,
            bio TEXT
        )
    ''')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    create_db()
