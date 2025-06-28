#!/usr/bin/env python3
"""
Helper script to run Django development server with network access
Allows access from both localhost and LAN IP addresses
"""

import os
import sys
import subprocess
import socket

def get_local_ip():
    """Get the local IP address of the machine"""
    try:
        # Connect to a remote address to get local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "127.0.0.1"

def main():
    print("🚀 Django Task Management System - Network Server")
    print("=" * 50)
    
    # Change to django_project directory
    os.chdir("django_project")
    
    # Get local IP
    local_ip = get_local_ip()
    
    print(f"📍 Local IP: {local_ip}")
    print(f"🌐 Network Access: http://{local_ip}:8000")
    print(f"🏠 Local Access: http://127.0.0.1:8000")
    print(f"🔧 Admin Panel: http://{local_ip}:8000/admin/")
    print("=" * 50)
    
    # Run the server with 0.0.0.0 binding
    try:
        print("Starting Django server with network access...")
        print("Press Ctrl+C to stop the server")
        print("-" * 50)
        
        subprocess.run([
            sys.executable, "manage.py", "runserver", "0.0.0.0:8000"
        ])
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("Make sure you're in the correct directory and Django is installed")

if __name__ == "__main__":
    main() 