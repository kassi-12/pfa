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

# Mapping category text values to numeric IDs
category_map = {
    'appetizer': 1,
    'main-course': 2,
    'dessert': 3,
    'beverage': 4
}

@eel.expose
def add_product(name, category, price, description, active, quantity):
    try:
        category_id = category_map.get(category.lower())
        if category_id is None:
            raise ValueError(f"Invalid category: {category}")

        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO products (name, category_id, price, description, active, quantity) VALUES (?, ?, ?, ?, ?, ?)', 
                       (name, category_id, price, description, active, quantity))
        conn.commit()
        logging.info(f"Product {name} added successfully!")
        return "Product added successfully!"
    except Exception as e:
        logging.error(f"An error occurred while adding product {name}: {e}")
        return f"An error occurred: {e}"
    finally:
        if conn:
            conn.close()


#implement the fetch_products function
@eel.expose
def fetch_products():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT id, name, category_id, price, description, active, quantity FROM products')
        products = cursor.fetchall()
        logging.info("Products fetched successfully!")
        return products
    except Exception as e:
        logging.error(f"An error occurred while fetching products: {e}")
        return f"An error occurred: {e}"
    finally:
        if conn:
            conn.close()

@eel.expose
def delete_product(product_id):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM products WHERE id = ?', (product_id,))
        conn.commit()
        logging.info(f"Product {product_id} deleted successfully!")
        return "Product deleted successfully!"
    except Exception as e:
        logging.error(f"An error occurred while deleting product {product_id}: {e}")
        return f"An error occurred: {e}"
    finally:
        if conn:
            conn.close()

@eel.expose
def fetch_product_details(product_id):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT id, name, category_id, price, description, active, quantity FROM products WHERE id = ?', (product_id,))
        product = cursor.fetchone()
        if product:
            return {
                'id': product[0],
                'name': product[1],
                'category_id': product[2],
                'price': product[3],
                'description': product[4],
                'active': bool(product[5]),
                'quantity': product[6]
            }
        else:
            return None
    except Exception as e:
        logging.error(f"An error occurred while fetching product details for {product_id}: {e}")
        return None
    finally:
        if conn:
            conn.close()

@eel.expose
def modify_product(product_id, name, category_id, price, description, active, quantity):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM products WHERE id = ?', (product_id,))
        product = cursor.fetchone()
        if product:
            cursor.execute('UPDATE products SET name = ?, category_id = ?, price = ?, description = ?, active = ?, quantity = ? WHERE id = ?', (name, category_id, price, description, active, quantity, product_id))
            conn.commit()
            logging.info(f"Product {product_id} modified successfully!")
            return "Product modified successfully!"
        else:
            return "Product not found!"
    except Exception as e:
        logging.error(f"An error occurred while modifying product {product_id}: {e}")
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
