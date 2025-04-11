from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CompostDataViewSet, VolunteerViewSet, get_csrf_token

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'compost', CompostDataViewSet)
router.register(r'volunteers', VolunteerViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('csrf/', get_csrf_token, name='csrf-token'),
] 