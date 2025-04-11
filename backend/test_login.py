import requests
import json
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:8000/api"

def test_login(username, password):
    """Test user login via the API"""
    try:
        logger.info(f"Testing login for username: {username}")
        url = f"{BASE_URL}/users/login/"
        data = {
            "username": username,
            "password": password
        }
        
        # Make the request
        response = requests.post(url, json=data)
        logger.info(f"Status code: {response.status_code}")
        
        # Format and print response
        try:
            formatted_response = json.dumps(response.json(), indent=2)
            logger.info(f"Response: {formatted_response}")
        except:
            logger.info(f"Response (raw): {response.text}")
        
        # Return success status
        return response.status_code == 200
    except Exception as e:
        logger.error(f"Error during login test: {str(e)}")
        return False

def test_auth_check():
    """Test authenticated status check"""
    try:
        logger.info("Testing authentication status check")
        url = f"{BASE_URL}/users/check_auth/"
        
        # Create a session to maintain cookies
        session = requests.Session()
        
        # First login
        login_url = f"{BASE_URL}/users/login/"
        login_data = {
            "username": "testuser_final",
            "password": "password123"
        }
        
        login_response = session.post(login_url, json=login_data)
        if login_response.status_code != 200:
            logger.error("Login failed, cannot check authentication status")
            return False
        
        # Now check auth with the same session
        auth_response = session.get(url)
        logger.info(f"Auth check status code: {auth_response.status_code}")
        try:
            formatted_response = json.dumps(auth_response.json(), indent=2)
            logger.info(f"Auth check response: {formatted_response}")
        except:
            logger.info(f"Auth check response (raw): {auth_response.text}")
        
        return auth_response.status_code == 200
    except Exception as e:
        logger.error(f"Error during auth check: {str(e)}")
        return False

if __name__ == "__main__":
    # Get command-line arguments or use defaults
    username = sys.argv[1] if len(sys.argv) > 1 else "testuser_final"
    password = sys.argv[2] if len(sys.argv) > 2 else "password123"
    
    # Run tests
    logger.info(f"Testing login for user: {username}")
    login_success = test_login(username, password)
    
    if login_success:
        logger.info("✅ Login test passed!")
        
        # Also test auth check
        auth_success = test_auth_check()
        if auth_success:
            logger.info("✅ Authentication check test passed!")
        else:
            logger.error("❌ Authentication check test failed!")
    else:
        logger.error("❌ Login test failed!") 