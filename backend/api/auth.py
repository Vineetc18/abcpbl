import bcrypt
from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class SimpleAuthBackend(ModelBackend):
    """
    Simple authentication backend that extends Django's ModelBackend.
    """
    
    def authenticate(self, request, username=None, password=None, **kwargs):
        if not username or not password:
            return None
            
        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                return user
            return None
        except User.DoesNotExist:
            return None
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            return None
    
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None 