import sqlite3
import os
import datetime

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

# Define additional timestamp fields that might be missing
missing_timestamp_fields = []
if 'created_at' not in column_names:
    missing_timestamp_fields.append(('created_at', 'TIMESTAMP', datetime.datetime.now().isoformat()))
if 'updated_at' not in column_names:
    missing_timestamp_fields.append(('updated_at', 'TIMESTAMP', datetime.datetime.now().isoformat()))

# Add missing timestamp fields
for field_name, field_type, default_value in missing_timestamp_fields:
    print(f"Adding missing timestamp field '{field_name}'")
    try:
        cursor.execute(f"ALTER TABLE api_compostdata ADD COLUMN {field_name} {field_type} DEFAULT '{default_value}'")
        conn.commit()
        print(f"Added {field_name} successfully")
    except Exception as e:
        print(f"Error adding {field_name}: {e}")

# Check for the existence of all expected columns
expected_columns = [
    'id', 'user_id', 'title', 'servings', 'description', 'location',
    'foodType', 'expiresIn', 'phone', 'email', 'image', 'status',
    'created_at', 'updated_at', 'date', 'notes', 'is_user_donation', 'weight'
]

missing_columns = [col for col in expected_columns if col not in column_names]
if missing_columns:
    print(f"Still missing columns: {missing_columns}")
else:
    print("All expected columns exist in the table")

# Close the connection
conn.close() 