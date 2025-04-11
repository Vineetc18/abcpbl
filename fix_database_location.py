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

# Create a temp table with the same structure but with location as nullable
print("Creating temporary table...")
cursor.execute("""
CREATE TABLE api_compostdata_temp (
    id INTEGER PRIMARY KEY,
    date TEXT,
    location TEXT,
    status TEXT,
    notes TEXT,
    is_user_donation BOOLEAN,
    user_id INTEGER,
    weight REAL,
    title TEXT,
    servings INTEGER,
    description TEXT,
    foodType TEXT,
    expiresIn TEXT,
    phone TEXT,
    email TEXT,
    image TEXT,
    FOREIGN KEY (user_id) REFERENCES api_user (id)
)
""")
conn.commit()

# Copy the data from the original table to the temp table
print("Copying data to temporary table...")
cursor.execute("""
INSERT INTO api_compostdata_temp
SELECT id, date, location, status, notes, is_user_donation, user_id, weight,
       title, servings, description, foodType, expiresIn, phone, email, image
FROM api_compostdata
""")
conn.commit()

# Drop the original table
print("Dropping original table...")
cursor.execute("DROP TABLE api_compostdata")
conn.commit()

# Rename the temp table to the original name
print("Renaming temporary table to original name...")
cursor.execute("ALTER TABLE api_compostdata_temp RENAME TO api_compostdata")
conn.commit()

print("Location field is now nullable!")

# Close the connection
conn.close()
print("Database connection closed.") 