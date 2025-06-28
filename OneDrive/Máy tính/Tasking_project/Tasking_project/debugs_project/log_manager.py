#!/usr/bin/env python3
"""
Log Manager for Employee Task Management System
Provides log analysis, monitoring, and cleanup functions
"""

import os
import re
from datetime import datetime, timedelta
from collections import defaultdict
import sys

class LogManager:
    def __init__(self, log_dir='debugs_project'):
        self.log_dir = log_dir
        self.activity_log = os.path.join(log_dir, 'activity.log')
        self.error_log = os.path.join(log_dir, 'error.log')
        self.debug_log = os.path.join(log_dir, 'debug.log')
        
    def ensure_log_files(self):
        """Ensure log directory and files exist"""
        os.makedirs(self.log_dir, exist_ok=True)
        
        for log_file in [self.activity_log, self.error_log, self.debug_log]:
            if not os.path.exists(log_file):
                with open(log_file, 'w') as f:
                    f.write(f"# Log file created: {datetime.now()}\n")
                    
    def analyze_activity_logs(self, days=7):
        """Analyze activity logs for the past N days"""
        if not os.path.exists(self.activity_log):
            print(f"Activity log not found: {self.activity_log}")
            return
            
        stats = {
            'total_logins': 0,
            'failed_logins': 0,
            'successful_logins': 0,
            'check_ins': 0,
            'check_outs': 0,
            'dashboard_views': 0,
            'users': set(),
            'daily_activity': defaultdict(int),
        }
        
        cutoff_date = datetime.now() - timedelta(days=days)
        
        try:
            with open(self.activity_log, 'r') as f:
                for line in f:
                    if not line.strip() or line.startswith('#'):
                        continue
                        
                    # Parse log line
                    if 'Login attempt' in line:
                        stats['total_logins'] += 1
                        if 'Failed login' in line:
                            stats['failed_logins'] += 1
                        else:
                            stats['successful_logins'] += 1
                            
                    elif 'checked in' in line:
                        stats['check_ins'] += 1
                        
                    elif 'checked out' in line:
                        stats['check_outs'] += 1
                        
                    elif 'Dashboard accessed' in line:
                        stats['dashboard_views'] += 1
                        
                    # Extract username
                    user_match = re.search(r'user[:\s]+(\w+)', line, re.IGNORECASE)
                    if user_match:
                        stats['users'].add(user_match.group(1))
                        
                    # Extract date for daily stats
                    date_match = re.search(r'(\d{4}-\d{2}-\d{2})', line)
                    if date_match:
                        date_str = date_match.group(1)
                        stats['daily_activity'][date_str] += 1
                        
        except Exception as e:
            print(f"Error reading activity log: {e}")
            return
            
        # Print analysis
        print(f"\n📊 ACTIVITY ANALYSIS (Last {days} days)")
        print("=" * 50)
        print(f"Total Login Attempts: {stats['total_logins']}")
        print(f"Successful Logins: {stats['successful_logins']}")
        print(f"Failed Logins: {stats['failed_logins']}")
        print(f"Check-ins: {stats['check_ins']}")
        print(f"Check-outs: {stats['check_outs']}")
        print(f"Dashboard Views: {stats['dashboard_views']}")
        print(f"Active Users: {len(stats['users'])}")
        print(f"User List: {', '.join(sorted(stats['users']))}")
        
        if stats['daily_activity']:
            print(f"\n📅 Daily Activity:")
            for date in sorted(stats['daily_activity'].keys())[-7:]:
                print(f"  {date}: {stats['daily_activity'][date]} events")
                
    def check_errors(self, hours=24):
        """Check for errors in the last N hours"""
        if not os.path.exists(self.error_log):
            print(f"Error log not found: {self.error_log}")
            return
            
        cutoff_time = datetime.now() - timedelta(hours=hours)
        error_count = 0
        recent_errors = []
        
        try:
            with open(self.error_log, 'r') as f:
                for line in f:
                    if not line.strip() or line.startswith('#'):
                        continue
                        
                    # Extract timestamp
                    timestamp_match = re.search(r'(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})', line)
                    if timestamp_match:
                        try:
                            log_time = datetime.strptime(timestamp_match.group(1), '%Y-%m-%d %H:%M:%S')
                            if log_time >= cutoff_time:
                                error_count += 1
                                recent_errors.append(line.strip())
                        except ValueError:
                            pass
                            
        except Exception as e:
            print(f"Error reading error log: {e}")
            return
            
        print(f"\n🚨 ERROR ANALYSIS (Last {hours} hours)")
        print("=" * 50)
        print(f"Total Errors: {error_count}")
        
        if recent_errors:
            print(f"\nRecent Errors:")
            for error in recent_errors[-10:]:  # Show last 10 errors
                print(f"  • {error}")
        else:
            print("✅ No recent errors found!")
            
    def monitor_system_health(self):
        """Monitor overall system health"""
        print(f"\n🏥 SYSTEM HEALTH CHECK")
        print("=" * 50)
        
        # Check log file sizes
        for log_name, log_path in [
            ('Activity Log', self.activity_log),
            ('Error Log', self.error_log),
            ('Debug Log', self.debug_log)
        ]:
            if os.path.exists(log_path):
                size = os.path.getsize(log_path)
                print(f"{log_name}: {size:,} bytes ({size/1024/1024:.2f} MB)")
            else:
                print(f"{log_name}: ❌ Not found")
                
        # Check recent activity
        self.analyze_activity_logs(days=1)
        self.check_errors(hours=24)
        
    def cleanup_old_logs(self, days=30):
        """Clean up old log entries (simulation)"""
        print(f"\n🧹 LOG CLEANUP (older than {days} days)")
        print("=" * 50)
        
        cutoff_date = datetime.now() - timedelta(days=days)
        
        for log_name, log_path in [
            ('Activity Log', self.activity_log),
            ('Error Log', self.error_log),
            ('Debug Log', self.debug_log)
        ]:
            if not os.path.exists(log_path):
                continue
                
            try:
                lines_to_keep = []
                old_lines_count = 0
                
                with open(log_path, 'r') as f:
                    for line in f:
                        timestamp_match = re.search(r'(\d{4}-\d{2}-\d{2})', line)
                        if timestamp_match:
                            try:
                                log_date = datetime.strptime(timestamp_match.group(1), '%Y-%m-%d')
                                if log_date >= cutoff_date:
                                    lines_to_keep.append(line)
                                else:
                                    old_lines_count += 1
                            except ValueError:
                                lines_to_keep.append(line)  # Keep lines without valid dates
                        else:
                            lines_to_keep.append(line)  # Keep lines without dates
                            
                print(f"{log_name}: Would remove {old_lines_count} old entries")
                
            except Exception as e:
                print(f"Error processing {log_name}: {e}")
                
    def tail_logs(self, lines=10):
        """Show last N lines from all logs"""
        for log_name, log_path in [
            ('Activity Log', self.activity_log),
            ('Error Log', self.error_log),
            ('Debug Log', self.debug_log)
        ]:
            print(f"\n📋 {log_name} (Last {lines} lines)")
            print("-" * 50)
            
            if not os.path.exists(log_path):
                print("❌ Log file not found")
                continue
                
            try:
                with open(log_path, 'r') as f:
                    all_lines = f.readlines()
                    recent_lines = all_lines[-lines:] if len(all_lines) > lines else all_lines
                    
                    if recent_lines:
                        for line in recent_lines:
                            print(line.rstrip())
                    else:
                        print("📝 Log file is empty")
                        
            except Exception as e:
                print(f"❌ Error reading log: {e}")

def main():
    """Main function with command line interface"""
    log_manager = LogManager()
    log_manager.ensure_log_files()
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == 'analyze':
            days = int(sys.argv[2]) if len(sys.argv) > 2 else 7
            log_manager.analyze_activity_logs(days)
            
        elif command == 'errors':
            hours = int(sys.argv[2]) if len(sys.argv) > 2 else 24
            log_manager.check_errors(hours)
            
        elif command == 'health':
            log_manager.monitor_system_health()
            
        elif command == 'cleanup':
            days = int(sys.argv[2]) if len(sys.argv) > 2 else 30
            log_manager.cleanup_old_logs(days)
            
        elif command == 'tail':
            lines = int(sys.argv[2]) if len(sys.argv) > 2 else 10
            log_manager.tail_logs(lines)
            
        else:
            print(f"Unknown command: {command}")
            print_usage()
            
    else:
        # Default: show system health
        log_manager.monitor_system_health()

def print_usage():
    """Print usage information"""
    print("\n📖 LOG MANAGER USAGE")
    print("=" * 50)
    print("python log_manager.py [command] [options]")
    print("\nCommands:")
    print("  analyze [days]     - Analyze activity logs (default: 7 days)")
    print("  errors [hours]     - Check recent errors (default: 24 hours)")
    print("  health             - System health check")
    print("  cleanup [days]     - Simulate log cleanup (default: 30 days)")
    print("  tail [lines]       - Show recent log entries (default: 10 lines)")
    print("  (no command)       - Show system health")
    print("\nExamples:")
    print("  python log_manager.py analyze 3")
    print("  python log_manager.py errors 6")
    print("  python log_manager.py tail 20")

if __name__ == "__main__":
    main() 