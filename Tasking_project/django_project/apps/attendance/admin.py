from django.contrib import admin
from .models import Attendance, AttendanceSummary

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'check_in', 'check_out', 'status', 'worked_hours_display', 'is_late')
    list_filter = ('status', 'date', 'user__userprofile__department')
    search_fields = ('user__username', 'user__first_name', 'user__last_name')
    readonly_fields = ('worked_hours_display', 'is_late', 'created_at', 'updated_at')
    date_hierarchy = 'date'
    
    fieldsets = (
        ('Attendance Info', {
            'fields': ('user', 'date', 'status')
        }),
        ('Time Tracking', {
            'fields': ('check_in', 'check_out', 'worked_hours_display', 'is_late')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'user__userprofile')

@admin.register(AttendanceSummary)
class AttendanceSummaryAdmin(admin.ModelAdmin):
    list_display = ('user', 'month', 'total_days', 'present_days', 'late_days', 'absent_days', 'attendance_percentage')
    list_filter = ('month', 'user__userprofile__department')
    search_fields = ('user__username', 'user__first_name', 'user__last_name')
    readonly_fields = ('attendance_percentage', 'created_at', 'updated_at')
    date_hierarchy = 'month'
    
    fieldsets = (
        ('Summary Info', {
            'fields': ('user', 'month', 'total_days')
        }),
        ('Attendance Breakdown', {
            'fields': ('present_days', 'late_days', 'absent_days', 'half_days', 'total_hours')
        }),
        ('Statistics', {
            'fields': ('attendance_percentage',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ) 