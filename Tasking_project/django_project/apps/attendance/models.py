from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, time, timedelta

class Attendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('late', 'Late'),
        ('absent', 'Absent'),
        ('half_day', 'Half Day'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(default=timezone.now)
    check_in = models.DateTimeField(blank=True, null=True)
    check_out = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='absent')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.date} ({self.status})"
    
    @property
    def worked_hours(self):
        """Calculate total worked hours"""
        if self.check_in and self.check_out:
            delta = self.check_out - self.check_in
            return delta.total_seconds() / 3600  # Convert to hours
        return 0
    
    @property
    def worked_hours_display(self):
        """Display worked hours in HH:MM format"""
        hours = self.worked_hours
        if hours:
            h = int(hours)
            m = int((hours - h) * 60)
            return f"{h:02d}:{m:02d}"
        return "00:00"
    
    @property
    def is_late(self):
        """Check if check-in is late (after 9:00 AM)"""
        if self.check_in:
            standard_time = time(9, 0)  # 9:00 AM
            check_in_time = self.check_in.time()
            return check_in_time > standard_time
        return False
    
    @property
    def status_badge_class(self):
        status_classes = {
            'present': 'bg-success',
            'late': 'bg-warning',
            'absent': 'bg-danger',
            'half_day': 'bg-info',
        }
        return status_classes.get(self.status, 'bg-secondary')
    
    def save(self, *args, **kwargs):
        # Auto-determine status based on check-in/check-out
        if self.check_in and self.check_out:
            if self.is_late:
                self.status = 'late'
            elif self.worked_hours < 4:  # Less than 4 hours = half day
                self.status = 'half_day'
            else:
                self.status = 'present'
        elif self.check_in:
            self.status = 'late' if self.is_late else 'present'
        else:
            self.status = 'absent'
            
        super().save(*args, **kwargs)
    
    class Meta:
        unique_together = ['user', 'date']
        ordering = ['-date']

class AttendanceSummary(models.Model):
    """Monthly attendance summary for each user"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendance_summaries')
    month = models.DateField()  # First day of the month
    total_days = models.IntegerField(default=0)
    present_days = models.IntegerField(default=0)
    late_days = models.IntegerField(default=0)
    absent_days = models.IntegerField(default=0)
    half_days = models.IntegerField(default=0)
    total_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.month.strftime('%B %Y')}"
    
    @property
    def attendance_percentage(self):
        if self.total_days == 0:
            return 0
        return (self.present_days + self.late_days + self.half_days) / self.total_days * 100
    
    class Meta:
        unique_together = ['user', 'month']
        ordering = ['-month'] 