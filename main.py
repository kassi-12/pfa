import eel
import sqlite3
import os
import logging
import webview

# Configure logging
logging.basicConfig(filename='app.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Initialize Eel
eel.init("web")

# Get the path to the database
db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'web', 'database', 'restaurant.db'))
print(f"Database path: {db_path}")

# Function to add a user
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
        logging.info(f"User {username} added successfully!")
        return "User added successfully!"
    except sqlite3.IntegrityError:
        logging.warning("Email already exists!")
        return "Email already exists!"
    except Exception as e:
        logging.error(f"An error occurred while adding user {username}: {e}")
        return f"An error occurred: {e}"
    finally:
        if conn:
            conn.close()

# Function to fetch users
@eel.expose
def fetch_users():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT username, email, first_name, last_name, phone FROM users')
        users = cursor.fetchall()
        logging.info("Users fetched successfully!")
        return users
    except Exception as e:
        logging.error(f"An error occurred while fetching users: {e}")
        return f"An error occurred: {e}"
    finally:
        if conn:
            conn.close()

@eel.expose
def add_table(table_name, capacity, availability, status):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO tables (table_name, capacity, availability, status)
            VALUES (?, ?, ?, ?)
        ''', (table_name, capacity, availability, status))
        conn.commit()
        logging.info(f"Table {table_name} added successfully!")
        return "Table added successfully!"
    except sqlite3.IntegrityError:
        logging.warning("Table already exists!")
        return "Table already exists!"
    except Exception as e:
        logging.error(f"An error occurred while adding table {table_name}: {e}")
        return f"An error occurred: {e}"
    finally:
        if conn:
            conn.close()
@eel.expose
def fetch_tables():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT id, table_name, capacity, availability, status FROM tables')
        tables = cursor.fetchall()
        logging.info("Tables fetched successfully!")
        return tables
    except Exception as e:
        logging.error(f"An error occurred while fetching tables: {e}")
        return f"An error occurred: {e}"
    finally:
        if conn:
            conn.close()


eel.start("login.html", size=(1920, 1080))
# # Start the Eel application
# def start_app():
#     try:
#         print("Starting the webview window...")
#         webview.create_window('Your App', 'web/login.html', width=1920, height=1080)
#         webview.start()  # This should be included to start the webview loop
#     except Exception as e:
#         logging.error(f"Failed to start the Eel application: {e}")

# if __name__ == "__main__":
#     print("Starting the application...")
#     start_app()

#     # Main loop to keep the application running
#     try:
#         while True:
#             eel.sleep(1.0)
#     except KeyboardInterrupt:
#         logging.info("Application terminated by user")
#     except Exception as e:
#         logging.error(f"An unexpected error occurred: {e}")
