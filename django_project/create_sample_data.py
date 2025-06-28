#!/usr/bin/env python
"""
Script to create sample data for Employee Task Management System
Run this after migrations: python manage.py shell < create_sample_data.py
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
from apps.tasks.models import Project, Task, TaskComment
from apps.attendance.models import Attendance
from apps.dashboard.models import Notification

def create_users():
    """Create sample users with profiles"""
    print("Creating users...")
    
    # Create admin user
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
    
    UserProfile.objects.get_or_create(
        user=admin_user,
        defaults={
            'role': 'admin',
            'department': 'IT',
            'position': 'System Administrator',
            'phone': '+1234567890',
            'hire_date': timezone.now().date() - timedelta(days=365)
        }
    )
    
    # Create managers
    managers_data = [
        {
            'username': 'manager1',
            'email': 'manager1@taskmanager.com',
            'first_name': 'John',
            'last_name': 'Smith',
            'department': 'Development',
            'position': 'Development Manager'
        },
        {
            'username': 'manager2', 
            'email': 'manager2@taskmanager.com',
            'first_name': 'Sarah',
            'last_name': 'Johnson',
            'department': 'Design',
            'position': 'Design Manager'
        }
    ]
    
    for manager_data in managers_data:
        user, created = User.objects.get_or_create(
            username=manager_data['username'],
            defaults={
                'email': manager_data['email'],
                'first_name': manager_data['first_name'],
                'last_name': manager_data['last_name'],
                'is_staff': True,
            }
        )
        if created:
            user.set_password('manager123')
            user.save()
        
        UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'role': 'manager',
                'department': manager_data['department'],
                'position': manager_data['position'],
                'phone': f'+123456789{manager_data["username"][-1]}',
                'hire_date': timezone.now().date() - timedelta(days=300)
            }
        )
    
    # Create regular users
    users_data = [
        {'username': 'user1', 'first_name': 'Alice', 'last_name': 'Brown', 'department': 'Development'},
        {'username': 'user2', 'first_name': 'Bob', 'last_name': 'Wilson', 'department': 'Development'},
        {'username': 'user3', 'first_name': 'Carol', 'last_name': 'Davis', 'department': 'Design'},
        {'username': 'user4', 'first_name': 'David', 'last_name': 'Miller', 'department': 'QA'},
        {'username': 'user5', 'first_name': 'Eva', 'last_name': 'Garcia', 'department': 'Marketing'},
    ]
    
    for i, user_data in enumerate(users_data, 1):
        user, created = User.objects.get_or_create(
            username=user_data['username'],
            defaults={
                'email': f'{user_data["username"]}@taskmanager.com',
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
            }
        )
        if created:
            user.set_password('user123')
            user.save()
        
        UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'role': 'user',
                'department': user_data['department'],
                'position': f'{user_data["department"]} Specialist',
                'phone': f'+12345678{i}0',
                'hire_date': timezone.now().date() - timedelta(days=200-i*20)
            }
        )
    
    print(f"Created {User.objects.count()} users")

def create_projects():
    """Create sample projects"""
    print("Creating projects...")
    
    manager1 = User.objects.get(username='manager1')
    manager2 = User.objects.get(username='manager2')
    
    projects_data = [
        {
            'name': 'Website Development',
            'description': 'Development of new company website with modern UI/UX design',
            'created_by': manager1
        },
        {
            'name': 'Mobile App',
            'description': 'iOS and Android mobile application for customer engagement',
            'created_by': manager1
        },
        {
            'name': 'Database Migration',
            'description': 'Migration from legacy database system to modern cloud solution',
            'created_by': manager2
        }
    ]
    
    for project_data in projects_data:
        Project.objects.get_or_create(
            name=project_data['name'],
            defaults=project_data
        )
    
    print(f"Created {Project.objects.count()} projects")

def create_tasks():
    """Create sample tasks"""
    print("Creating tasks...")
    
    projects = Project.objects.all()
    manager1 = User.objects.get(username='manager1')
    manager2 = User.objects.get(username='manager2')
    users = User.objects.filter(userprofile__role='user')
    
    tasks_data = [
        # Website Development tasks
        {
            'title': 'Setup Development Environment',
            'description': 'Configure development environment with necessary tools and frameworks',
            'project': projects.get(name='Website Development'),
            'assigned_to': users.get(username='user1'),
            'assigned_by': manager1,
            'status': 'completed',
            'priority': 'high',
            'deadline': timezone.now() - timedelta(days=5),
            'estimated_hours': 8
        },
        {
            'title': 'Design Homepage Layout',
            'description': 'Create wireframes and design for the main homepage',
            'project': projects.get(name='Website Development'),
            'assigned_to': users.get(username='user3'),
            'assigned_by': manager1,
            'status': 'in_progress',
            'priority': 'medium',
            'deadline': timezone.now() + timedelta(days=3),
            'estimated_hours': 16
        },
        {
            'title': 'Implement User Authentication',
            'description': 'Develop login/logout functionality with security features',
            'project': projects.get(name='Website Development'),
            'assigned_to': users.get(username='user1'),
            'assigned_by': manager1,
            'status': 'new',
            'priority': 'high',
            'deadline': timezone.now() + timedelta(days=7),
            'estimated_hours': 20
        },
        
        # Mobile App tasks
        {
            'title': 'Research Mobile Frameworks',
            'description': 'Evaluate React Native vs Flutter for cross-platform development',
            'project': projects.get(name='Mobile App'),
            'assigned_to': users.get(username='user2'),
            'assigned_by': manager1,
            'status': 'completed',
            'priority': 'medium',
            'deadline': timezone.now() - timedelta(days=10),
            'estimated_hours': 12
        },
        {
            'title': 'Create App Mockups',
            'description': 'Design user interface mockups for main app screens',
            'project': projects.get(name='Mobile App'),
            'assigned_to': users.get(username='user3'),
            'assigned_by': manager1,
            'status': 'review',
            'priority': 'medium',
            'deadline': timezone.now() + timedelta(days=2),
            'estimated_hours': 24
        },
        {
            'title': 'Setup CI/CD Pipeline',
            'description': 'Configure automated testing and deployment pipeline',
            'project': projects.get(name='Mobile App'),
            'assigned_to': users.get(username='user4'),
            'assigned_by': manager1,
            'status': 'new',
            'priority': 'low',
            'deadline': timezone.now() + timedelta(days=14),
            'estimated_hours': 16
        },
        
        # Database Migration tasks
        {
            'title': 'Analyze Current Database',
            'description': 'Document current database schema and identify migration requirements',
            'project': projects.get(name='Database Migration'),
            'assigned_to': users.get(username='user2'),
            'assigned_by': manager2,
            'status': 'in_progress',
            'priority': 'urgent',
            'deadline': timezone.now() + timedelta(days=1),
            'estimated_hours': 32
        },
        {
            'title': 'Setup Cloud Infrastructure',
            'description': 'Configure cloud database and security settings',
            'project': projects.get(name='Database Migration'),
            'assigned_to': users.get(username='user4'),
            'assigned_by': manager2,
            'status': 'new',
            'priority': 'high',
            'deadline': timezone.now() + timedelta(days=5),
            'estimated_hours': 20
        },
        {
            'title': 'Data Migration Testing',
            'description': 'Test data migration process with sample data',
            'project': projects.get(name='Database Migration'),
            'assigned_to': users.get(username='user5'),
            'assigned_by': manager2,
            'status': 'new',
            'priority': 'medium',
            'deadline': timezone.now() + timedelta(days=10),
            'estimated_hours': 24
        },
        {
            'title': 'Performance Optimization',
            'description': 'Optimize database queries and improve performance',
            'project': projects.get(name='Database Migration'),
            'assigned_to': users.get(username='user1'),
            'assigned_by': manager2,
            'status': 'new',
            'priority': 'low',
            'deadline': timezone.now() + timedelta(days=20),
            'estimated_hours': 16
        }
    ]
    
    for task_data in tasks_data:
        task, created = Task.objects.get_or_create(
            title=task_data['title'],
            project=task_data['project'],
            defaults=task_data
        )
        
        # Add some comments to completed/in-progress tasks
        if task.status in ['completed', 'in_progress', 'review'] and created:
            TaskComment.objects.create(
                task=task,
                user=task.assigned_to,
                comment=f"Working on {task.title}. Making good progress!"
            )
            
            if task.status == 'completed':
                TaskComment.objects.create(
                    task=task,
                    user=task.assigned_by,
                    comment="Great work! Task completed successfully."
                )
    
    print(f"Created {Task.objects.count()} tasks")

def create_attendance():
    """Create sample attendance records"""
    print("Creating attendance records...")
    
    users = User.objects.filter(userprofile__role__in=['user', 'manager'])
    
    # Create attendance for the last 7 days
    for i in range(7):
        date = timezone.now().date() - timedelta(days=i)
        
        for user in users:
            # Skip some days for variety (weekends, sick days, etc.)
            if i == 0:  # Today - some users might not have checked in yet
                if user.username in ['user1', 'user2', 'manager1']:
                    check_in_time = timezone.now().replace(
                        hour=9, minute=0, second=0, microsecond=0
                    ) + timedelta(minutes=15 if user.username == 'user2' else 0)
                    
                    attendance = Attendance.objects.create(
                        user=user,
                        date=date,
                        check_in=check_in_time
                    )
                    
                    # Some users have checked out
                    if user.username == 'manager1':
                        attendance.check_out = check_in_time + timedelta(hours=8, minutes=30)
                        attendance.save()
            elif i == 1 or i == 2:  # Yesterday and day before - full attendance
                check_in_time = timezone.now().replace(
                    hour=9, minute=0, second=0, microsecond=0
                ) - timedelta(days=i) + timedelta(
                    minutes=10 if user.username in ['user2', 'user4'] else 0
                )
                
                check_out_time = check_in_time + timedelta(hours=8, minutes=30)
                
                Attendance.objects.get_or_create(
                    user=user,
                    date=date,
                    defaults={
                        'check_in': check_in_time,
                        'check_out': check_out_time
                    }
                )
            elif i in [5, 6]:  # Weekend - no attendance
                continue
            else:
                # Weekdays with some variations
                if user.username not in ['user5']:  # user5 was absent
                    check_in_time = timezone.now().replace(
                        hour=9, minute=0, second=0, microsecond=0
                    ) - timedelta(days=i) + timedelta(
                        minutes=20 if user.username == 'user3' else 5
                    )
                    
                    check_out_time = check_in_time + timedelta(
                        hours=8 if user.username != 'user4' else 4,  # user4 half day
                        minutes=30
                    )
                    
                    Attendance.objects.get_or_create(
                        user=user,
                        date=date,
                        defaults={
                            'check_in': check_in_time,
                            'check_out': check_out_time
                        }
                    )
    
    print(f"Created {Attendance.objects.count()} attendance records")

def create_notifications():
    """Create sample notifications"""
    print("Creating notifications...")
    
    admin = User.objects.get(username='admin')
    manager1 = User.objects.get(username='manager1')
    all_users = User.objects.filter(userprofile__role='user')
    
    notifications_data = [
        {
            'title': 'System Maintenance Scheduled',
            'message': 'System maintenance is scheduled for this weekend. Please save your work.',
            'notification_type': 'warning',
            'sender': admin,
            'is_global': True
        },
        {
            'title': 'New Project Assigned',
            'message': 'You have been assigned to the new Website Development project.',
            'notification_type': 'info',
            'sender': manager1,
            'is_global': False
        },
        {
            'title': 'Task Deadline Reminder',
            'message': 'Reminder: Your task "Design Homepage Layout" is due in 3 days.',
            'notification_type': 'warning',
            'sender': manager1,
            'is_global': False
        },
        {
            'title': 'Welcome to TaskManager',
            'message': 'Welcome to our new task management system! Please update your profile.',
            'notification_type': 'success',
            'sender': admin,
            'is_global': True
        }
    ]
    
    for notif_data in notifications_data:
        notification = Notification.objects.create(
            title=notif_data['title'],
            message=notif_data['message'],
            notification_type=notif_data['notification_type'],
            sender=notif_data['sender'],
            is_global=notif_data['is_global']
        )
        
        if not notif_data['is_global']:
            # Add specific recipients
            notification.recipients.add(*all_users[:2])
    
    print(f"Created {Notification.objects.count()} notifications")

def main():
    """Main function to create all sample data"""
    print("Starting sample data creation...")
    
    try:
        create_users()
        create_projects() 
        create_tasks()
        create_attendance()
        create_notifications()
        
        print("\n" + "="*50)
        print("SAMPLE DATA CREATED SUCCESSFULLY!")
        print("="*50)
        print("\nDemo accounts:")
        print("Admin: admin / admin123")
        print("Manager: manager1 / manager123")
        print("Manager: manager2 / manager123")
        print("User: user1 / user123")
        print("User: user2 / user123")
        print("User: user3 / user123")
        print("User: user4 / user123")
        print("User: user5 / user123")
        print("\nYou can now run: python manage.py runserver")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main() 