#!/usr/bin/env python
"""
Debug script để kiểm tra và fix dashboard summary issues
Run: python debug_dashboard_summary.py
"""

import os
import sys
import django
from datetime import datetime, timedelta
from django.utils import timezone

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tasking_project.settings')
django.setup()

from django.contrib.auth.models import User
from apps.authentication.models import UserProfile
from apps.tasks.models import Project, Task
from apps.attendance.models import Attendance
from apps.dashboard.models import Notification
from django.db.models import Count, Q

def check_dashboard_data():
    """Check dashboard data completeness"""
    print("🔍 DASHBOARD DATA ANALYSIS")
    print("=" * 50)
    
    # Check users
    total_users = User.objects.filter(is_active=True).count()
    admin_users = UserProfile.objects.filter(role='admin').count()
    manager_users = UserProfile.objects.filter(role='manager').count()
    regular_users = UserProfile.objects.filter(role='user').count()
    
    print(f"👥 USERS:")
    print(f"   Total active users: {total_users}")
    print(f"   Admin users: {admin_users}")
    print(f"   Manager users: {manager_users}")
    print(f"   Regular users: {regular_users}")
    
    # Check projects
    total_projects = Project.objects.count()
    active_projects = Project.objects.filter(is_active=True).count()
    
    print(f"\n📂 PROJECTS:")
    print(f"   Total projects: {total_projects}")
    print(f"   Active projects: {active_projects}")
    
    # Check tasks
    total_tasks = Task.objects.count()
    task_status_breakdown = Task.objects.values('status').annotate(count=Count('id'))
    
    print(f"\n📋 TASKS:")
    print(f"   Total tasks: {total_tasks}")
    for status in task_status_breakdown:
        print(f"   {status['status']}: {status['count']}")
    
    # Check attendance today
    today = timezone.now().date()
    today_attendance = Attendance.objects.filter(date=today).count()
    checked_in_today = Attendance.objects.filter(date=today, check_in__isnull=False).count()
    
    print(f"\n⏰ ATTENDANCE (Today {today}):")
    print(f"   Total attendance records: {today_attendance}")
    print(f"   Checked in today: {checked_in_today}")
    
    # Check notifications
    total_notifications = Notification.objects.count()
    recent_notifications = Notification.objects.filter(created_at__gte=today - timedelta(days=7)).count()
    
    print(f"\n🔔 NOTIFICATIONS:")
    print(f"   Total notifications: {total_notifications}")
    print(f"   Recent (7 days): {recent_notifications}")
    
    return {
        'users': total_users,
        'projects': total_projects,
        'tasks': total_tasks,
        'attendance': today_attendance,
        'notifications': total_notifications
    }

def create_minimal_data():
    """Create minimal data if missing"""
    print("\n🔧 CREATING MINIMAL DATA")
    print("=" * 50)
    
    # Ensure admin user exists
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@taskmanager.com',
            'first_name': 'System',
            'last_name': 'Administrator',
            'is_staff': True,
            'is_superuser': True,
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print("✅ Created admin user")
    
    # Ensure admin UserProfile exists
    admin_profile, created = UserProfile.objects.get_or_create(
        user=admin_user,
        defaults={
            'role': 'admin',
            'department': 'IT',
            'position': 'System Administrator',
            'phone': '+1234567890',
            'hire_date': timezone.now().date() - timedelta(days=365)
        }
    )
    if created:
        print("✅ Created admin UserProfile")
    
    # Create sample project if none exist
    if Project.objects.count() == 0:
        project = Project.objects.create(
            name='Sample Project',
            description='Sample project for testing dashboard',
            created_by=admin_user,
            is_active=True
        )
        print("✅ Created sample project")
        
        # Create sample task
        Task.objects.create(
            title='Sample Task',
            description='Sample task for testing dashboard',
            project=project,
            assigned_to=admin_user,
            assigned_by=admin_user,
            status='new',
            priority='medium',
            deadline=timezone.now() + timedelta(days=7),
            estimated_hours=8
        )
        print("✅ Created sample task")
    
    # Create sample attendance if none exist for today
    today = timezone.now().date()
    if not Attendance.objects.filter(user=admin_user, date=today).exists():
        Attendance.objects.create(
            user=admin_user,
            date=today,
            check_in=timezone.now().replace(hour=9, minute=0),
            status='present'
        )
        print("✅ Created sample attendance")
    
    # Create sample notification if none exist
    if Notification.objects.count() == 0:
        Notification.objects.create(
            title='Welcome to Task Manager',
            message='Welcome to the Employee Task Management System!',
            is_global=True,
            created_by=admin_user
        )
        print("✅ Created sample notification")

def test_dashboard_views():
    """Test dashboard view functionality"""
    print("\n🧪 TESTING DASHBOARD VIEWS")
    print("=" * 50)
    
    # Test admin user dashboard context
    admin_user = User.objects.get(username='admin')
    
    # Simulate view logic
    try:
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        
        # Basic stats
        total_users = User.objects.filter(is_active=True).count()
        total_projects = Project.objects.count()
        total_tasks = Task.objects.count()
        
        print(f"✅ Basic stats calculated:")
        print(f"   Users: {total_users}")
        print(f"   Projects: {total_projects}")
        print(f"   Tasks: {total_tasks}")
        
        # Task stats for admin
        task_stats = {
            'total': Task.objects.filter(assigned_to=admin_user).count(),
            'new': Task.objects.filter(assigned_to=admin_user, status='new').count(),
            'in_progress': Task.objects.filter(assigned_to=admin_user, status='in_progress').count(),
            'completed': Task.objects.filter(assigned_to=admin_user, status='completed').count(),
        }
        print(f"✅ Admin task stats: {task_stats}")
        
        # Attendance summary
        total_employees = User.objects.filter(is_active=True, userprofile__role='user').exclude(userprofile__isnull=True).count()
        checked_in_today = Attendance.objects.filter(date=today, check_in__isnull=False).count()
        late_arrivals_today = Attendance.objects.filter(date=today, status='late').count()
        on_time_arrivals = checked_in_today - late_arrivals_today
        
        attendance_summary = {
            'total_employees': total_employees,
            'checked_in': checked_in_today,
            'late_arrivals': late_arrivals_today,
            'on_time_arrivals': on_time_arrivals,
            'attendance_rate': round((checked_in_today / total_employees * 100) if total_employees > 0 else 0, 1),
        }
        print(f"✅ Attendance summary: {attendance_summary}")
        
        # Project progress
        active_projects = Project.objects.filter(is_active=True)
        project_progress = []
        
        for project in active_projects:
            total_tasks_proj = project.tasks.count()
            completed_tasks_proj = project.tasks.filter(status='completed').count()
            progress_percentage = (completed_tasks_proj / total_tasks_proj * 100) if total_tasks_proj > 0 else 0
            
            project_progress.append({
                'project': project,
                'total_tasks': total_tasks_proj,
                'completed_tasks': completed_tasks_proj,
                'progress': round(progress_percentage, 1),
            })
        
        print(f"✅ Project progress calculated for {len(project_progress)} projects")
        
        return True
        
    except Exception as e:
        print(f"❌ Dashboard view test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def fix_dashboard_context_issues():
    """Fix common dashboard context issues"""
    print("\n🔧 FIXING DASHBOARD CONTEXT ISSUES")
    print("=" * 50)
    
    # Check for users without UserProfile
    users_without_profile = User.objects.filter(userprofile__isnull=True, is_active=True)
    
    for user in users_without_profile:
        UserProfile.objects.create(
            user=user,
            role='user',
            department='General',
            position='Employee',
            hire_date=timezone.now().date()
        )
        print(f"✅ Created UserProfile for {user.username}")
    
    # Check for projects without tasks
    projects_without_tasks = Project.objects.filter(tasks__isnull=True)
    admin_user = User.objects.get(username='admin')
    
    for project in projects_without_tasks:
        Task.objects.create(
            title=f'Sample Task for {project.name}',
            description=f'Auto-generated task for project {project.name}',
            project=project,
            assigned_to=admin_user,
            assigned_by=admin_user,
            status='new',
            priority='medium',
            deadline=timezone.now() + timedelta(days=7),
            estimated_hours=8
        )
        print(f"✅ Created sample task for project: {project.name}")

def main():
    """Main debug function"""
    print("🚀 DASHBOARD SUMMARY DEBUG SCRIPT")
    print("=" * 60)
    
    # Step 1: Check current data
    data_summary = check_dashboard_data()
    
    # Step 2: Create minimal data if needed
    if any(count == 0 for count in data_summary.values()):
        create_minimal_data()
        print("\n📊 Data summary after creation:")
        check_dashboard_data()
    
    # Step 3: Fix context issues
    fix_dashboard_context_issues()
    
    # Step 4: Test dashboard views
    test_success = test_dashboard_views()
    
    print("\n" + "=" * 60)
    if test_success:
        print("✅ DASHBOARD SUMMARY DEBUG COMPLETED SUCCESSFULLY!")
        print("   Dashboard should now display summary data correctly.")
    else:
        print("❌ DASHBOARD SUMMARY DEBUG FAILED!")
        print("   Please check the error messages above.")
    
    print("=" * 60)
    print("\n💡 RECOMMENDATIONS:")
    print("1. Run: python manage.py runserver 0.0.0.0:8000")
    print("2. Login with: admin / admin123")
    print("3. Check dashboard summary displays correctly")
    print("4. If issues persist, check logs in debugs_project/")

if __name__ == "__main__":
    main() 