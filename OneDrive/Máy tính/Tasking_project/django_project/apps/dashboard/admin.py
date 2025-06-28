from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'notification_type', 'sender', 'is_global', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_global', 'is_read', 'created_at')
    search_fields = ('title', 'message', 'sender__username')
    readonly_fields = ('created_at',)
    filter_horizontal = ('recipients',)
    
    fieldsets = (
        ('Notification Info', {
            'fields': ('title', 'message', 'notification_type')
        }),
        ('Delivery', {
            'fields': ('sender', 'is_global', 'recipients', 'is_read')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('sender') 