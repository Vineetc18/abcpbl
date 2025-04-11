import requests
import json
import random
import string
import sys

BASE_URL = "http://localhost:8000/api"

def generate_random_string(length=5):
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def test_register(username=None, email=None, password=None):
    print("Testing registration...")
    
    if not username:
        # Generate random username if not provided
        random_suffix = generate_random_string()
        username = f"testuser_{random_suffix}"
        
    if not email:
        # Generate random email if not provided
        random_suffix = generate_random_string()
        email = f"test_{random_suffix}@example.com"
    
    if not password:
        password = "testpass123"
    
    print(f"Using username: {username}")
    url = f"{BASE_URL}/users/register/"
    data = {
        "username": username,
        "email": email,
        "password": password,
        "phone_number": "1234567890",
        "address": "Test Address"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        print()
        return response.status_code == 201, username, password
    except Exception as e:
        print(f"Error during registration: {str(e)}")
        return False, username, password

def test_login(username, password="testpass123"):
    print("Testing login...")
    print(f"Logging in with username: {username}")
    url = f"{BASE_URL}/users/login/"
    data = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        print()
        return response.status_code == 200
    except Exception as e:
        print(f"Error during login: {str(e)}")
        return False

if __name__ == "__main__":
    # Check if arguments are provided
    username = None
    email = None
    password = None
    
    if len(sys.argv) > 1:
        username = sys.argv[1]
    if len(sys.argv) > 2:
        email = sys.argv[2]
    if len(sys.argv) > 3:
        password = sys.argv[3]
    
    # Test registration
    success, username, password = test_register(username, email, password)
    
    if success:
        print("Registration successful!")
        
        # Test login with the newly created user
        if test_login(username, password):
            print("Login successful!")
        else:
            print("Login failed!")
    else:
        print("Registration failed!") 