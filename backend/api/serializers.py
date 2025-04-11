from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from .models import CompostData, Volunteer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'phone_number', 'address', 'is_volunteer']
        extra_kwargs = {
            'password': {'write_only': True},
            'phone_number': {'required': False},
            'address': {'required': False}
        }
    
    def create(self, validated_data):
        # Create a new user with Django's create_user method
        user = User.objects.create_user(**validated_data)
        return user

class CompostDataSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CompostData
        fields = [
            'id', 'user', 'title', 'servings', 'description', 'location',
            'foodType', 'expiresIn', 'phone', 'email', 'image', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
        extra_kwargs = {
            'location': {'required': False}
        }

    def create(self, validated_data):
        # The user will be set in the viewset's perform_create method
        return CompostData.objects.create(**validated_data)

class VolunteerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(required=False, write_only=True)
    
    class Meta:
        model = Volunteer
        fields = ('id', 'user', 'user_id', 'availability', 'skills', 'status', 'joined_date', 'updated_at')
        read_only_fields = ('joined_date', 'updated_at', 'status')

    def create(self, validated_data):
        # Remove user_id if it exists in validated data
        if 'user_id' in validated_data:
            validated_data.pop('user_id')
        
        # Create the volunteer instance
        return Volunteer.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        # Remove user_id if it exists
        if 'user_id' in validated_data:
            validated_data.pop('user_id')
        
        # Update the instance with the validated data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance 