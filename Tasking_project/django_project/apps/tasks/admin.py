from django.contrib import admin
from .models import Project, Task, TaskComment

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'task_count', 'progress_percentage', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at', 'created_by')
    search_fields = ('name', 'description', 'created_by__username')
    readonly_fields = ('created_at', 'updated_at', 'task_count', 'progress_percentage')
    
    fieldsets = (
        ('Project Info', {
            'fields': ('name', 'description', 'is_active')
        }),
        ('Statistics', {
            'fields': ('task_count', 'progress_percentage'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only set created_by for new objects
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing existing object
            return self.readonly_fields + ('created_by',)
        return self.readonly_fields

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'assigned_to', 'assigned_by', 'status', 'priority', 'deadline', 'is_overdue')
    list_filter = ('status', 'priority', 'project', 'assigned_by', 'created_at')
    search_fields = ('title', 'description', 'assigned_to__username', 'assigned_by__username')
    readonly_fields = ('created_at', 'updated_at', 'started_at', 'completed_at', 'is_overdue')
    date_hierarchy = 'deadline'
    
    fieldsets = (
        ('Task Info', {
            'fields': ('title', 'description', 'project')
        }),
        ('Assignment', {
            'fields': ('assigned_to', 'assigned_by', 'status', 'priority', 'deadline')
        }),
        ('Time Tracking', {
            'fields': ('estimated_hours', 'actual_hours', 'started_at', 'completed_at'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('project', 'assigned_to', 'assigned_by')

class TaskCommentInline(admin.TabularInline):
    model = TaskComment
    extra = 0
    readonly_fields = ('created_at',)

# Add inline comments to TaskAdmin
TaskAdmin.inlines = [TaskCommentInline]

@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ('task', 'user', 'comment_preview', 'created_at')
    list_filter = ('created_at', 'user')
    search_fields = ('task__title', 'user__username', 'comment')
    readonly_fields = ('created_at',)
    
    def comment_preview(self, obj):
        return obj.comment[:50] + '...' if len(obj.comment) > 50 else obj.comment
    comment_preview.short_description = 'Comment Preview' 