#!/usr/bin/env python
"""
Setup script for Employee Task Management System (Windows-optimized)
This script will run migrations and create sample data using SQLite
"""

import os
import sys
import subprocess

def run_command(command, description):
    """Run a command and print status"""
    print(f"\n{description}...")
    print(f"Running: {command}")
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print("✅ Success")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        if e.stdout:
            print("STDOUT:", e.stdout)
        if e.stderr:
            print("STDERR:", e.stderr)
        return False

def main():
    """Main setup function"""
    print("="*60)
    print("Employee Task Management System - Windows Setup")
    print("="*60)
    
    # Check if we're in the right directory
    if not os.path.exists('manage.py'):
        print("❌ Error: manage.py not found. Please run this script from the django_project directory.")
        return False
    
    # Run migrations
    commands = [
        ("python manage.py makemigrations", "Creating migrations"),
        ("python manage.py migrate", "Applying migrations"),
        ("python manage.py collectstatic --noinput", "Collecting static files"),
    ]
    
    for command, description in commands:
        if not run_command(command, description):
            print(f"❌ Setup failed at: {description}")
            return False
    
    # Create sample data
    print("\n" + "="*40)
    print("Creating sample data...")
    print("="*40)
    
    try:
        exec(open('create_sample_data.py').read())
        print("✅ Sample data created successfully")
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        return False
    
    print("\n" + "="*60)
    print("🎉 SETUP COMPLETED SUCCESSFULLY!")
    print("="*60)
    print("\n📝 Next steps:")
    print("1. No database configuration needed - using SQLite")
    print("2. Run: python manage.py runserver 5000")
    print("3. Open browser to: http://127.0.0.1:5000")
    print("\n🔑 Demo login credentials:")
    print("   Admin: admin / admin123")
    print("   Manager: manager1 / manager123") 
    print("   User: user1 / user123")
    print("\n💡 Notes:")
    print("   - SQLite database file: db.sqlite3")
    print("   - Avatar uploads disabled (no Pillow required)")
    print("   - Perfect for Windows development environment")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 