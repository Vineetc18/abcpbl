from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)

class User(AbstractUser):
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    
    phone_number = models.CharField(
        validators=[phone_regex],
        max_length=15,
        blank=True,
        null=True
    )
    address = models.TextField(blank=True, null=True)
    is_volunteer = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.username} ({self.email})"

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

class CompostData(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('collected', 'Collected'),
        ('processed', 'Processed'),
        ('distributed', 'Distributed')
    ]

    FOOD_TYPE_CHOICES = [
        ('Baked', 'Baked'),
        ('Canned Food', 'Canned Food'),
        ('Prepared Food', 'Prepared Food'),
        ('Dairy Products', 'Dairy Products'),
        ('Others', 'Others')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='compost_data')
    title = models.CharField(max_length=255, default="Food Donation")
    servings = models.IntegerField(default=1)
    description = models.TextField(default="No description provided")
    location = models.CharField(max_length=255, null=True, blank=True)
    foodType = models.CharField(max_length=50, choices=FOOD_TYPE_CHOICES, default='Others')
    expiresIn = models.DateTimeField(null=True, blank=True)
    phone = models.CharField(max_length=15, blank=True, default="")
    email = models.EmailField(blank=True, default="")
    image = models.ImageField(upload_to='food_images/', null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.user.username}"

    class Meta:
        verbose_name_plural = 'Compost Data'
        ordering = ['-created_at']

class Volunteer(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('pending', 'Pending'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='volunteer_profile')
    availability = models.CharField(max_length=255)
    skills = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    joined_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Volunteer - {self.user.username}"

    class Meta:
        verbose_name_plural = 'Volunteers' 