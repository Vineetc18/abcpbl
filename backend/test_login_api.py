import requests
import json
import sys

def test_login(username, password):
    """Test the login API endpoint"""
    url = "http://localhost:8000/api/users/login/"
    
    # Print request info
    print(f"Testing login for user: {username}")
    print(f"URL: {url}")
    
    # Prepare request data
    data = {
        "username": username,
        "password": password
    }
    
    # Send request
    try:
        print("Sending request...")
        response = requests.post(url, json=data)
        
        # Print status code
        print(f"Status code: {response.status_code}")
        
        # Try to decode JSON response
        try:
            json_response = response.json()
            print(f"Response: {json.dumps(json_response, indent=2)}")
        except:
            print(f"Raw response: {response.text}")
            
        # Return success/failure
        return response.status_code == 200
    except Exception as e:
        print(f"Error during login test: {e}")
        return False

if __name__ == "__main__":
    # Get username and password from command line
    username = "testuser"
    password = "testpassword"
    
    if len(sys.argv) >= 3:
        username = sys.argv[1]
        password = sys.argv[2]
    
    # Run test
    success = test_login(username, password)
    
    # Print result
    if success:
        print("\nLogin successful!")
    else:
        print("\nLogin failed!") 