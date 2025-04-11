from django.contrib import admin
from .models import User, CompostData, Volunteer

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_volunteer', 'is_staff', 'date_joined')
    list_filter = ('is_volunteer', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone_number', 'address')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_volunteer', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )

@admin.register(CompostData)
class CompostDataAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'servings', 'foodType', 'status', 'created_at')
    list_filter = ('status', 'foodType', 'created_at')
    search_fields = ('title', 'description', 'user__username')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {'fields': ('user', 'title', 'description')}),
        ('Donation Details', {'fields': ('servings', 'foodType', 'expiresIn', 'location')}),
        ('Contact Information', {'fields': ('phone', 'email')}),
        ('Status', {'fields': ('status',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_availability_display', 'status', 'joined_date')
    list_filter = ('status', 'joined_date')
    search_fields = ('user__username', 'user__email', 'skills')
    readonly_fields = ('joined_date', 'updated_at')
    actions = ['approve_volunteers', 'deactivate_volunteers', 'reactivate_volunteers']
    fieldsets = (
        (None, {'fields': ('user', 'status')}),
        ('Volunteer Details', {'fields': ('availability', 'skills')}),
        ('Timestamps', {'fields': ('joined_date', 'updated_at')}),
    )
    
    def get_availability_display(self, obj):
        """Format the JSON availability data for display"""
        try:
            import json
            availability = json.loads(obj.availability)
            days = ', '.join(availability.get('days', []))
            times = ', '.join(availability.get('timeSlots', []))
            transport = availability.get('transportation', 'Not specified')
            return f"Days: {days} | Times: {times} | Transport: {transport}"
        except:
            return obj.availability
    
    get_availability_display.short_description = 'Availability'
    
    def approve_volunteers(self, request, queryset):
        """Approve pending volunteers by setting their status to active"""
        updated = queryset.update(status='active')
        self.message_user(request, f'{updated} volunteer(s) successfully approved.')
    approve_volunteers.short_description = "Approve selected volunteers"
    
    def deactivate_volunteers(self, request, queryset):
        """Set selected volunteers status to inactive"""
        updated = queryset.update(status='inactive')
        self.message_user(request, f'{updated} volunteer(s) deactivated.')
    deactivate_volunteers.short_description = "Deactivate selected volunteers"
    
    def reactivate_volunteers(self, request, queryset):
        """Reactivate inactive volunteers"""
        updated = queryset.filter(status='inactive').update(status='active')
        self.message_user(request, f'{updated} volunteer(s) reactivated.')
    reactivate_volunteers.short_description = "Reactivate selected volunteers" 