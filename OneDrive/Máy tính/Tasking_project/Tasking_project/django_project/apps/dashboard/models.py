from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Notification(models.Model):
    TYPE_CHOICES = [
        ('info', 'Information'),
        ('warning', 'Warning'),
        ('success', 'Success'),
        ('danger', 'Important'),
    ]
    
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='info')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications')
    recipients = models.ManyToManyField(User, related_name='received_notifications', blank=True)
    is_global = models.BooleanField(default=False)  # If true, visible to all users
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
    @property
    def type_badge_class(self):
        type_classes = {
            'info': 'badge-info',
            'warning': 'badge-warning', 
            'success': 'badge-success',
            'danger': 'badge-danger',
        }
        return type_classes.get(self.notification_type, 'badge-info')
    
    class Meta:
        ordering = ['-created_at'] 