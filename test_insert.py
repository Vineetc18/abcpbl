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

try:
    # Get first user id for the test
    print("Querying for users...")
    cursor.execute("SELECT id FROM api_user LIMIT 1")
    result = cursor.fetchone()
    print(f"Query result: {result}")
    
    if not result:
        print("No users found in the database.")
        conn.close()
        exit(1)

    user_id = result[0]
    print(f"Using user_id: {user_id}")

    # Current time for timestamps
    current_time = datetime.datetime.now().isoformat()

    # Prepare test data
    test_data = {
        'user_id': user_id,
        'title': 'Test Food Donation',
        'servings': 5,
        'description': 'This is a test donation',
        'location': 'Test Location',
        'foodType': 'Others',
        'expiresIn': (datetime.datetime.now() + datetime.timedelta(days=3)).isoformat(),
        'phone': '1234567890',
        'email': 'test@example.com',
        'status': 'pending',
        'created_at': current_time,
        'updated_at': current_time,
        'date': current_time,
        'notes': 'Test notes',
        'is_user_donation': True,
        'weight': 2.5
    }

    # Build the SQL query
    columns = ', '.join(test_data.keys())
    placeholders = ', '.join(['?' for _ in test_data])
    values = tuple(test_data.values())

    # Insert test record
    insert_query = f"INSERT INTO api_compostdata ({columns}) VALUES ({placeholders})"
    print(f"Executing: {insert_query}")
    print(f"Values: {values}")
    cursor.execute(insert_query, values)
    conn.commit()
    print("Test record inserted successfully!")
    
    # Verify the record was inserted
    cursor.execute("SELECT * FROM api_compostdata WHERE title = 'Test Food Donation'")
    result = cursor.fetchone()
    if result:
        print("Record found in database!")
    else:
        print("Error: Record not found after insertion.")
        
except Exception as e:
    print(f"Error: {str(e)}")
    conn.rollback()

# Close the connection
conn.close() 