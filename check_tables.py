import sqlite3
import os

# Determine the correct database path
current_dir = os.path.dirname(os.path.abspath(__file__))
if os.path.basename(current_dir) == 'backend':
    db_path = 'db.sqlite3'
else:
    db_path = 'backend/db.sqlite3'
    
print(f"Using database at: {db_path}")

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get a list of tables in the database
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables in the database:")
for table in tables:
    print(f"- {table[0]}")

# For the api_compostdata table, get the schema
try:
    cursor.execute("PRAGMA table_info(api_compostdata)")
    columns = cursor.fetchall()
    print("\nSchema for api_compostdata table:")
    for column in columns:
        print(f"- {column[1]} ({column[2]}) {'NOT NULL' if column[3] else 'NULL'}")
except Exception as e:
    print(f"Error getting schema for api_compostdata: {e}")

# For the api_user table if it exists
try:
    cursor.execute("PRAGMA table_info(api_user)")
    columns = cursor.fetchall()
    print("\nSchema for api_user table:")
    for column in columns:
        print(f"- {column[1]} ({column[2]}) {'NOT NULL' if column[3] else 'NULL'}")
except Exception as e:
    print(f"Error getting schema for api_user: {e}")

# Close the connection
conn.close() 