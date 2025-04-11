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

# Check the current schema of the table
cursor.execute("PRAGMA table_info(api_compostdata)")
columns = cursor.fetchall()
column_names = [column[1] for column in columns]

print("Current columns in api_compostdata table:", column_names)

# Define the expected columns based on the model
expected_columns = [
    {'name': 'title', 'type': 'TEXT', 'default': "'Food Donation'"},
    {'name': 'servings', 'type': 'INTEGER', 'default': 1},
    {'name': 'description', 'type': 'TEXT', 'default': "'No description provided'"},
    {'name': 'location', 'type': 'TEXT', 'default': "NULL", 'nullable': True},
    {'name': 'foodType', 'type': 'TEXT', 'default': "'Others'"},
    {'name': 'expiresIn', 'type': 'TIMESTAMP', 'default': 'NULL'},
    {'name': 'phone', 'type': 'TEXT', 'default': "''"},
    {'name': 'email', 'type': 'TEXT', 'default': "''"},
    {'name': 'image', 'type': 'TEXT', 'default': 'NULL'},
    {'name': 'status', 'type': 'TEXT', 'default': "'pending'"},
]

# Add missing columns to the table
columns_added = 0
for column in expected_columns:
    if column['name'] not in column_names:
        print(f"Adding '{column['name']}' column to api_compostdata table")
        try:
            cursor.execute(f"ALTER TABLE api_compostdata ADD COLUMN {column['name']} {column['type']} DEFAULT {column['default']}")
            conn.commit()
            print(f"Column '{column['name']}' added successfully")
            columns_added += 1
        except Exception as e:
            print(f"Error adding column '{column['name']}': {e}")
    else:
        print(f"Column '{column['name']}' already exists")

if columns_added == 0:
    print("No columns needed to be added.")
else:
    print(f"Added {columns_added} columns to the database.")

# Verify the table schema after modifications
cursor.execute("PRAGMA table_info(api_compostdata)")
updated_columns = cursor.fetchall()
updated_column_names = [column[1] for column in updated_columns]
print("Updated columns in api_compostdata table:", updated_column_names)

# Close the connection
conn.close() 