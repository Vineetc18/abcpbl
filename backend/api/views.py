from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from .models import CompostData, Volunteer
from .serializers import UserSerializer, CompostDataSerializer, VolunteerSerializer
import logging
from datetime import datetime

# Get logger
logger = logging.getLogger(__name__)
User = get_user_model()

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    """Get CSRF token for the frontend"""
    return Response({'detail': 'CSRF cookie set'})

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'register', 'login']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['post'])
    @method_decorator(csrf_protect)
    def register(self, request):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                # Extract user data
                username = serializer.validated_data.get('username')
                email = serializer.validated_data.get('email')
                password = serializer.validated_data.get('password')
                phone_number = serializer.validated_data.get('phone_number', '')
                address = serializer.validated_data.get('address', '')
                
                # Create user with Django ORM
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    phone_number=phone_number,
                    address=address
                )
                
                # Log in the user after registration
                login(request, user)
                
                return Response({
                    'message': 'Registration successful',
                    'user': {
                        'username': user.username,
                        'email': user.email,
                        'id': str(user.id)
                    }
                }, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error during registration: {str(e)}")
            return Response({'error': 'An unexpected error occurred'}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    @method_decorator(csrf_protect)
    def login(self, request):
        """Login endpoint using Django authentication"""
        try:
            # Extract credentials
            username = request.data.get('username')
            password = request.data.get('password')
            
            logger.info(f"Login attempt for user: {username}")
            
            # Basic validation
            if not username or not password:
                return Response(
                    {'error': 'Username and password are required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Authenticate using Django's built-in authentication
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                # Log in the user
                login(request, user)
                
                # Set session expiry
                request.session.set_expiry(86400)  # 24 hours
                
                return Response({
                    'message': 'Login successful',
                    'user': {
                        'username': user.username,
                        'email': user.email,
                        'id': str(user.id)
                    }
                })
            
            # If authentication failed
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
                
        except Exception as e:
            logger.error(f"Unexpected login error: {str(e)}")
            return Response(
                {'error': 'An unexpected error occurred'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def logout_user(self, request):
        try:
            logout(request)
            return Response({'message': 'Logout successful'})
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return Response({'error': 'An unexpected error occurred'}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def check_auth(self, request):
        """Check if the user is authenticated"""
        if request.user.is_authenticated:
            return Response({
                'is_authenticated': True,
                'user': {
                    'username': request.user.username,
                    'email': request.user.email,
                    'id': str(request.user.id)
                }
            })
        return Response({'is_authenticated': False}, status=status.HTTP_401_UNAUTHORIZED)

class CompostDataViewSet(viewsets.ModelViewSet):
    queryset = CompostData.objects.all()
    serializer_class = CompostDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            # Return all compost data objects, not just the user's
            return CompostData.objects.all()
        except Exception as e:
            logger.error(f"Error getting compost data: {str(e)}")
            return CompostData.objects.none()

    def perform_create(self, serializer):
        try:
            # Create with Django ORM
            serializer.save(user=self.request.user)
        except Exception as e:
            logger.error(f"Error creating compost data: {str(e)}")
            raise

class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            return Volunteer.objects.filter(user=self.request.user)
        except Exception as e:
            logger.error(f"Error getting volunteer data: {str(e)}")
            return Volunteer.objects.none()

    def perform_create(self, serializer):
        try:
            # Check if the user is already a volunteer
            existing_volunteer = Volunteer.objects.filter(user=self.request.user).first()
            if existing_volunteer:
                raise ValidationError("You are already registered as a volunteer.")
            
            # Update user's is_volunteer status
            user = self.request.user
            user.is_volunteer = True
            user.save()
            
            # Create volunteer profile
            serializer.save(user=self.request.user)
            logger.info(f"Successfully created volunteer profile for user: {self.request.user.username}")
        except ValidationError as e:
            logger.error(f"Validation error creating volunteer record: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Error creating volunteer record: {str(e)}")
            raise

    def perform_update(self, serializer):
        try:
            # Update with Django ORM
            serializer.save()
            logger.info(f"Successfully updated volunteer profile for user: {self.request.user.username}")
        except Exception as e:
            logger.error(f"Error updating volunteer record: {str(e)}")
            raise

    def perform_destroy(self, instance):
        try:
            # Update user's is_volunteer status
            user = instance.user
            user.is_volunteer = False
            user.save()
            
            # Delete from Django ORM
            instance.delete()
            logger.info(f"Successfully deleted volunteer profile for user: {user.username}")
        except Exception as e:
            logger.error(f"Error deleting volunteer record: {str(e)}")
            raise 
