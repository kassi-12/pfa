import sqlite3
import os

def create_db():
    db_dir = os.path.join(os.path.dirname(__file__), 'web', 'database')
    os.makedirs(db_dir, exist_ok=True)
    
    db_path = os.path.join(db_dir, 'restaurant.db')
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create category table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS category (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            status TEXT
            
        )
    ''')

    # Create company table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS company (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            language TEXT,
            theme TEXT,
            restaurant_name TEXT,
            address TEXT,
            phone TEXT,
            currency TEXT,
            timezone TEXT,
            tax_rate REAL
        )
    ''')

   # Create orders table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            table_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            order_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            gross_amount REAL NOT NULL,
            s_charge REAL NOT NULL,
            vat REAL NOT NULL,
            discount REAL DEFAULT 0,
            method TEXT,
            status TEXT NOT NULL,
            net_amount REAL NOT NULL
        )
    ''')

    # Create order_items table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    ''')

    # Create products table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category_id INTEGER NOT NULL,
            price REAL NOT NULL,
            status TEXT,
            description TEXT,
            action TEXT,
            FOREIGN KEY (category_id) REFERENCES category(id)
        )
    ''')
    # Create table table
    cursor.execute('''CREATE TABLE IF NOT EXISTS tables (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        table_name TEXT,
        capacity INTEGER,
        availability TEXT,
        status TEXT
    )''')
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        gender TEXT,
        phone TEXT,
        bio TEXT,
        group_id INTEGER,
        FOREIGN KEY (group_id) REFERENCES groups(id)
    )''')

    # Create groups table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_name TEXT NOT NULL
    )''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stock (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            unit TEXT,
            price_per_unit REAL
        )
    ''')

    # Commit changes and close connection
    conn.commit()
    conn.close()

    print("Tables created successfully.")

if __name__ == '__main__':
    create_db()
