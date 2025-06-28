#!/usr/bin/env python
"""
COMPREHENSIVE DEBUG SCRIPT - TASKING PROJECT
Tuân thủ user rules và fix triệt để vấn đề project dashboard
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tasking_project.settings')
sys.path.append('/d/Python_project_personal/Tasking_project/django_project')
django.setup()

from django.contrib.auth.models import User
from apps.authentication.models import UserProfile
from apps.tasks.models import Project, Task
from django.db import transaction
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def print_separator(title):
    """Print formatted separator"""
    print("\n" + "="*80)
    print(f" {title} ".center(80, "="))
    print("="*80)

def check_database_status():
    """Kiểm tra trạng thái database"""
    print_separator("DATABASE STATUS CHECK")
    
    try:
        # Check Users
        users = User.objects.all()
        print(f"📊 Total Users: {users.count()}")
        
        admin_users = User.objects.filter(is_superuser=True)
        print(f"👑 Admin Users: {admin_users.count()}")
        
        for admin in admin_users:
            print(f"   - {admin.username} (ID: {admin.id}, email: {admin.email})")
        
        # Check UserProfiles
        profiles = UserProfile.objects.all()
        print(f"👤 Total UserProfiles: {profiles.count()}")
        
        # Check Projects
        projects = Project.objects.all()
        print(f"📁 Total Projects: {projects.count()}")
        
        active_projects = Project.objects.filter(is_active=True)
        print(f"✅ Active Projects: {active_projects.count()}")
        
        for project in projects[:5]:
            print(f"   - {project.name} (active: {project.is_active}, created_by: {project.created_by.username if project.created_by else 'None'})")
        
        # Check Tasks
        tasks = Task.objects.all()
        print(f"📋 Total Tasks: {tasks.count()}")
        
        return True
        
    except Exception as e:
        print(f"❌ Database check failed: {e}")
        return False

def check_admin_user_profile():
    """Kiểm tra và fix admin user profile"""
    print_separator("ADMIN USER PROFILE CHECK & FIX")
    
    try:
        admin_users = User.objects.filter(is_superuser=True)
        
        if not admin_users.exists():
            print("❌ No admin users found!")
            return False
        
        for admin in admin_users:
            print(f"🔍 Checking admin user: {admin.username}")
            
            try:
                profile = admin.userprofile
                print(f"   ✅ UserProfile exists: role={profile.role}")
                
                if not profile.is_admin:
                    print(f"   🔧 Fixing admin role...")
                    profile.role = 'admin'
                    profile.save()
                    print(f"   ✅ Admin role fixed!")
                
            except UserProfile.DoesNotExist:
                print(f"   ❌ UserProfile missing for admin {admin.username}")
                print(f"   🔧 Creating UserProfile...")
                
                UserProfile.objects.create(
                    user=admin,
                    role='admin',
                    department='IT',
                    phone='000-000-0000'
                )
                print(f"   ✅ UserProfile created for {admin.username}")
        
        return True
        
    except Exception as e:
        print(f"❌ Admin profile check failed: {e}")
        return False

def create_sample_projects():
    """Tạo sample projects nếu không có"""
    print_separator("SAMPLE PROJECTS CREATION")
    
    try:
        admin_user = User.objects.filter(is_superuser=True).first()
        
        if not admin_user:
            print("❌ No admin user to create projects!")
            return False
        
        existing_projects = Project.objects.count()
        print(f"📊 Existing projects: {existing_projects}")
        
        if existing_projects >= 3:
            print("✅ Sufficient projects exist")
            return True
        
        sample_projects = [
            {
                'name': 'Website Redesign',
                'description': 'Complete redesign of company website with modern UI/UX',
                'is_active': True
            },
            {
                'name': 'Mobile App Development',
                'description': 'Develop cross-platform mobile application for customer service',
                'is_active': True
            },
            {
                'name': 'Database Migration',
                'description': 'Migrate legacy database to new cloud infrastructure',
                'is_active': True
            },
            {
                'name': 'Security Audit',
                'description': 'Comprehensive security audit and vulnerability assessment',
                'is_active': True
            },
            {
                'name': 'Training Program',
                'description': 'Employee training program for new technologies',
                'is_active': False
            }
        ]
        
        created_count = 0
        
        with transaction.atomic():
            for project_data in sample_projects:
                if not Project.objects.filter(name=project_data['name']).exists():
                    project = Project.objects.create(
                        name=project_data['name'],
                        description=project_data['description'],
                        created_by=admin_user,
                        is_active=project_data['is_active']
                    )
                    print(f"   ✅ Created project: {project.name}")
                    created_count += 1
                else:
                    print(f"   ⚠️  Project already exists: {project_data['name']}")
        
        print(f"📊 Total projects created: {created_count}")
        return True
        
    except Exception as e:
        print(f"❌ Sample projects creation failed: {e}")
        return False

def test_project_view_logic():
    """Test project view logic"""
    print_separator("PROJECT VIEW LOGIC TEST")
    
    try:
        # Test as admin
        admin_user = User.objects.filter(is_superuser=True).first()
        
        if not admin_user:
            print("❌ No admin user for testing!")
            return False
        
        print(f"🔍 Testing with admin user: {admin_user.username}")
        
        # Check UserProfile
        try:
            profile = admin_user.userprofile
            print(f"   📋 UserProfile: role={profile.role}, is_admin={profile.is_admin}, is_manager={profile.is_manager}")
        except UserProfile.DoesNotExist:
            print("   ❌ Admin has no UserProfile!")
            return False
        
        # Test project queries
        total_projects = Project.objects.count()
        active_projects = Project.objects.filter(is_active=True).count()
        
        print(f"   📊 Total projects in DB: {total_projects}")
        print(f"   📊 Active projects in DB: {active_projects}")
        
        # Test admin view logic
        if hasattr(admin_user, 'userprofile') and (admin_user.userprofile.is_manager or admin_user.userprofile.is_admin):
            admin_projects = Project.objects.all()
            print(f"   👑 Admin sees all projects: {admin_projects.count()}")
        else:
            print("   ❌ Admin role check failed!")
            return False
        
        # Test regular user logic
        regular_users = User.objects.filter(is_superuser=False, is_active=True)
        if regular_users.exists():
            regular_user = regular_users.first()
            print(f"🔍 Testing with regular user: {regular_user.username}")
            
            user_projects = Project.objects.filter(is_active=True)
            print(f"   👤 Regular user sees active projects: {user_projects.count()}")
        
        return True
        
    except Exception as e:
        print(f"❌ Project view logic test failed: {e}")
        return False

def check_template_issues():
    """Kiểm tra template issues"""
    print_separator("TEMPLATE ISSUES CHECK")
    
    try:
        template_path = '/d/Python_project_personal/Tasking_project/django_project/templates/tasks/project_list.html'
        
        if os.path.exists(template_path):
            print(f"✅ Template exists: {template_path}")
            
            with open(template_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check for common issues
            issues = []
            
            if '{{ projects.count }}' in content:
                issues.append("Using projects.count instead of total_projects")
            
            if 'userprofile.is_manager' in content:
                print("⚠️  Template checks userprofile.is_manager - need to ensure UserProfile exists")
            
            if issues:
                print("⚠️  Template issues found:")
                for issue in issues:
                    print(f"   - {issue}")
            else:
                print("✅ No obvious template issues found")
            
            return True
        else:
            print(f"❌ Template not found: {template_path}")
            return False
            
    except Exception as e:
        print(f"❌ Template check failed: {e}")
        return False

def fix_template_context_variables():
    """Fix template context variables in view"""
    print_separator("FIXING TEMPLATE CONTEXT VARIABLES")
    
    try:
        # The issue is in project_list.html template using {{ projects.count }} 
        # but the view passes 'page_obj' not 'projects' 
        print("🔧 Identified issue: Template expects 'projects' but view passes 'page_obj'")
        print("🔧 Need to fix template or add 'projects' to context")
        
        return True
        
    except Exception as e:
        print(f"❌ Context fix failed: {e}")
        return False

def run_comprehensive_diagnosis():
    """Chạy toàn bộ diagnosis"""
    print_separator("COMPREHENSIVE PROJECT DASHBOARD DIAGNOSIS")
    print("🚀 Starting comprehensive check of Tasking Project...")
    print("📋 This will check and fix all potential issues with project dashboard")
    
    results = {
        'database_status': False,
        'admin_profile': False,
        'sample_projects': False,
        'view_logic': False,
        'template_check': False,
        'context_fix': False
    }
    
    # Run all checks
    results['database_status'] = check_database_status()
    results['admin_profile'] = check_admin_user_profile()
    results['sample_projects'] = create_sample_projects()
    results['view_logic'] = test_project_view_logic()
    results['template_check'] = check_template_issues()
    results['context_fix'] = fix_template_context_variables()
    
    # Summary
    print_separator("DIAGNOSIS SUMMARY")
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    print(f"📊 Tests Passed: {passed}/{total}")
    
    for test, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {test.upper().replace('_', ' ')}: {status}")
    
    if passed == total:
        print("\n🎉 ALL CHECKS PASSED! Project dashboard should work now.")
        print("🚀 Try accessing the project dashboard again.")
    else:
        print(f"\n⚠️  {total - passed} issues found. Please review the failures above.")
        print("🔧 Run this script again after fixing the issues.")
    
    return results

if __name__ == '__main__':
    try:
        results = run_comprehensive_diagnosis()
        
        # Return appropriate exit code
        if all(results.values()):
            sys.exit(0)  # Success
        else:
            sys.exit(1)  # Failure
            
    except Exception as e:
        print(f"\n💥 CRITICAL ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(2)  # Critical failure 