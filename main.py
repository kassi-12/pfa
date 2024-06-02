import eel
import sqlite3
import os

eel.init("web")

# Path to the database file
db_path = os.path.join(os.path.dirname(__file__), 'web', 'database', 'users.db')

@eel.expose
def add_user(username, email, password, first_name, last_name, gender, phone, bio):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO users (username, email, password, first_name, last_name, gender, phone, bio)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (username, email, password, first_name, last_name, gender, phone, bio))
        conn.commit()
        conn.close()
        return "User added successfully!"
    except sqlite3.IntegrityError:
        return "Email already exists!"
    except Exception as e:
        return f"An error occurred: {e}"
@eel.expose
def fetch_users():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT username, email, first_name, last_name, phone FROM users')
        users = cursor.fetchall()
        conn.close()
        return users
    except Exception as e:
        return f"An error occurred: {e}"

eel.start("index.html", size=(1920, 1080))
