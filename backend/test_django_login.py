import os
import django
import logging
import uuid
import sys

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'compost_backend.settings')
django.setup()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

# Import Django-specific modules
from django.contrib.auth import get_user_model
User = get_user_model()

def print_user_model_info():
    """Print details about the User model"""
    logger.info("User model information:")
    logger.info(f"User model class: {User}")
    logger.info(f"User model fields: {[f.name for f in User._meta.fields]}")
    logger.info(f"Primary key field: {User._meta.pk.name}")
    logger.info(f"Primary key field type: {type(User._meta.pk)}")
    
    # Print information about ID field
    id_field = User._meta.get_field('id')
    logger.info(f"ID field type: {type(id_field)}")
    logger.info(f"ID field details: {id_field.__dict__}")

def test_user_creation(username, email, password):
    """Test basic Django user creation"""
    try:
        # Check if user exists
        try:
            user = User.objects.get(username=username)
            logger.info(f"User {username} already exists")
            logger.info(f"User ID: {user.id}")
            logger.info(f"User ID type: {type(user.id)}")
            logger.info(f"User __dict__: {user.__dict__}")
            
            # Try to save with a new ID
            if user.id is None:
                # This user has no ID, we need to create a new one
                logger.info("Creating a new user since existing one has no ID")
                new_user = User.objects.create(
                    username=f"{username}_new",
                    email=email
                )
                new_user.set_password(password)
                new_user.save()
                logger.info(f"Created new user {new_user.username} with ID: {new_user.id}")
                return new_user
            
            # Update password
            user.set_password(password)
            user.save()
            logger.info(f"Updated password for user {username}")
            return user
        except User.DoesNotExist:
            # Create new user using User.objects.create
            logger.info(f"User {username} does not exist, creating new user")
            user = User.objects.create(
                username=username,
                email=email
            )
            
            # Set password separately and save
            user.set_password(password)
            user.save()
            
            logger.info(f"Created new user {username} with ID: {user.id}")
            return user
    except Exception as e:
        logger.error(f"Error creating/updating user: {str(e)}")
        return None

def test_user_auth(username, password):
    """Test authenticating a user with username/password"""
    try:
        from django.contrib.auth import authenticate
        user = authenticate(username=username, password=password)
        
        if user:
            logger.info(f"Authentication successful for user {username}")
            return True
        else:
            logger.error(f"Authentication failed for user {username}")
            return False
    except Exception as e:
        logger.error(f"Error authenticating user: {str(e)}")
        return False

if __name__ == "__main__":
    # Print User model information
    print_user_model_info()
    
    # Get username and password from command line or use defaults
    username = sys.argv[1] if len(sys.argv) > 1 else f"testuser_{uuid.uuid4().hex[:6]}"
    email = sys.argv[2] if len(sys.argv) > 2 else f"{username}@example.com"
    password = sys.argv[3] if len(sys.argv) > 3 else "password123"
    
    logger.info(f"Testing with username: {username}, email: {email}")
    
    # Create or update user
    user = test_user_creation(username, email, password)
    
    if user:
        # Test authentication
        auth_result = test_user_auth(username, password)
        if auth_result:
            logger.info("✅ Test PASSED - User created and authenticated successfully")
        else:
            logger.error("❌ Test FAILED - User created but authentication failed")
    else:
        logger.error("❌ Test FAILED - Could not create/update user") 