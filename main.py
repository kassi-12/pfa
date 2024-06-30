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
def add_user(username, email, password, first_name, last_name, gender, phone, bio,group_id):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('''
        INSERT INTO users (username, email, password, first_name, last_name, gender, phone, bio, group_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (username, email, password, first_name, last_name, gender, phone, bio, group_id))

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
        cursor.execute('SELECT id,username, email, first_name, last_name, phone FROM users')
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
def fetch_userbyid(user_id):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT id, username, email, first_name, last_name, gender, phone, bio FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        logging.info(f"User {user_id} fetched successfully!")
        return user
    except Exception as e:
        logging.error(f"An error occurred while fetching user {user_id}: {e}")
        return None
    finally:
        if conn:
            conn.close()

@eel.expose
def update_user(user_id, username, email, password, first_name, last_name, gender, phone, bio,group_id):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('''
        UPDATE users
        SET username = ?, email = ?, password = ?, first_name = ?, last_name = ?, gender = ?, phone = ?, bio = ?, group_id = ?
        WHERE id = ?
        ''', (username, email, password, first_name, last_name, gender, phone, bio, group_id, user_id))

        conn.commit()
        logging.info(f"User {user_id} updated successfully!")
        return True
    except Exception as e:
        logging.error(f"An error occurred while updating user {user_id}: {e}")
        return False
    finally:
        if conn:
            conn.close()
@eel.expose
def delete_user(id):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM users WHERE id=?', (id,))
        conn.commit()
        logging.info(f"User with ID {id} deleted successfully!")
        return "User deleted successfully!"
    except Exception as e:
        logging.error(f"An error occurred while deleting user with ID {id}: {e}")
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

@eel.expose
def update_table(table_id, table_name, capacity, availability, status):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE tables
            SET table_name = ?, capacity = ?, availability = ?, status = ?
            WHERE id = ?
        ''', (table_name, capacity, availability, status, table_id))
        conn.commit()
        logging.info(f"Table {table_name} updated successfully!")
        return "Table updated successfully!"
    except Exception as e:
        logging.error(f"An error occurred while updating table {table_name}: {e}")
        return f"An error occurred: {e}"
    finally:
        if conn:
            conn.close()
# Function to delete a table
@eel.expose
def delete_table(id):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM tables WHERE id=?', (id,))
        conn.commit()
        logging.info(f"Table with ID {id} deleted successfully!")
        return "Table deleted successfully!"
    except Exception as e:
        logging.error(f"An error occurred while deleting table with ID {id}: {e}")
        return f"An error occurred: {e}"
    finally:
        if conn:
            conn.close()

# Function to fetch categories
@eel.expose
def fetch_categorys():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT id, name, status FROM category')
        categories = cursor.fetchall()
        logging.info("Categories fetched successfully!")
        return categories
    except Exception as e:
        logging.error(f"An error occurred while fetching categories: {e}")
        return []
    finally:
        if conn:
            conn.close()

# Function to add a category
@eel.expose
def add_category(name, status):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO category (name, status) VALUES (?, ?)', (name, status))
        conn.commit()
        logging.info(f"Category {name} added successfully!")
        return "Category added successfully!"
    except sqlite3.IntegrityError:
        logging.warning(f"Category with name '{name}' already exists.")
        return "Category with this name already exists."
    except Exception as e:
        logging.error(f"An error occurred while adding category: {e}")
        return "An error occurred while adding the category."
    finally:
        if conn:
            conn.close()

# Function to update a category
@eel.expose
def update_category(id, name, status):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('UPDATE category SET name = ?, status = ? WHERE id = ?', (name, status, id))
        conn.commit()
        logging.info(f"Category with ID {id} updated successfully!")
        return "Category updated successfully!"
    except Exception as e:
        logging.error(f"An error occurred while updating category: {e}")
        return "An error occurred while updating the category."
    finally:
        if conn:
            conn.close()

# Function to delete a category
@eel.expose
def delete_category(id):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM category WHERE id = ?', (id,))
        conn.commit()
        logging.info(f"Category with ID {id} deleted successfully!")
        return "Category deleted successfully!"
    except Exception as e:
        logging.error(f"An error occurred while deleting category: {e}")
        return "An error occurred while deleting the category."
    finally:
        if conn:
            conn.close()
# Function to fetch groups
@eel.expose
def fetch_groups():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT id, group_name FROM groups')
        groups = cursor.fetchall()
        logging.info("Groups fetched successfully!")
        return groups
    except Exception as e:
        logging.error(f"An error occurred while fetching groups: {e}")
        return []
    finally:
        if conn:
            conn.close()
@eel.expose
def add_group(group_name):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO groups (group_name) VALUES (?)', (group_name,))
        conn.commit()
        logging.info(f"Group '{group_name}' added successfully!")
        return "Group added successfully!"
    except sqlite3.IntegrityError:
        logging.warning(f"Group with name '{group_name}' already exists.")
        return "Group with this name already exists."
    except Exception as e:
        logging.error(f"An error occurred while adding group: {e}")
        return "An error occurred while adding the group."
    finally:
        if conn:
            conn.close()
# Function to fetch users by group ID
@eel.expose
def fetch_users_by_group(group_id):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, username, email, first_name, last_name, phone
            FROM users
            WHERE group_id = ?
        ''', (group_id,))
        users = cursor.fetchall()
        logging.info(f"Users for Group ID {group_id} fetched successfully!")
        return users
    except Exception as e:
        logging.error(f"An error occurred while fetching users for Group ID {group_id}: {e}")
        return []
    finally:
        if conn:
            conn.close()
# Function to update a group
@eel.expose
def update_group(id, group_name):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('UPDATE groups SET group_name = ? WHERE id = ?', (group_name, id))
        conn.commit()
        logging.info(f"Group with ID {id} updated successfully!")
        return "Group updated successfully!"
    except Exception as e:
        logging.error(f"An error occurred while updating group: {e}")
        return "An error occurred while updating the group."
    finally:
        if conn:
            conn.close()

# Function to delete a group
@eel.expose
def delete_group(id):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM groups WHERE id = ?', (id,))
        conn.commit()
        logging.info(f"Group with ID {id} deleted successfully!")
        return "Group deleted successfully!"
    except Exception as e:
        logging.error(f"An error occurred while deleting group: {e}")
        return "An error occurred while deleting the group."
    finally:
        if conn:
            conn.close()
@eel.expose
def fetch_products():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, name, category_id, price, status, action
            FROM products
        ''')
        products = cursor.fetchall()
        logging.info("Products fetched successfully!")
        return products
    except Exception as e:
        logging.error(f"An error occurred while fetching products: {e}")
        return []
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
