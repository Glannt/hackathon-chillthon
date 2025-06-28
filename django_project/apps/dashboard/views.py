from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db.models import Q, Count, Avg, Sum
from django.utils import timezone
from datetime import datetime, timedelta
from apps.tasks.models import Task, Project
from apps.attendance.models import Attendance
from apps.dashboard.models import Notification
from apps.authentication.models import UserProfile
import logging
import os
import re
from django.contrib import messages
from collections import defaultdict

# Get logger for this module
logger = logging.getLogger('apps')
activity_logger = logging.getLogger('apps.dashboard')

@login_required
def home(request):
    """Main dashboard view with role-based content"""
    user = request.user
    today = timezone.now().date()
    
    # Log user dashboard access
    logger.info(f"Dashboard accessed by user: {user.username} ({user.get_full_name()}) at {timezone.now()}")
    
    try:
        # Get user's tasks
        user_tasks = Task.objects.filter(assigned_to=user).order_by('-created_at')[:5]
        
        # Task statistics
        task_stats = {
            'total': Task.objects.filter(assigned_to=user).count(),
            'new': Task.objects.filter(assigned_to=user, status='new').count(),
            'in_progress': Task.objects.filter(assigned_to=user, status='in_progress').count(),
            'completed': Task.objects.filter(assigned_to=user, status='completed').count(),
            'overdue': Task.objects.filter(
                assigned_to=user, 
                deadline__lt=timezone.now(),
                status__in=['new', 'in_progress']
            ).count(),
        }
        
        # Today's attendance
        today_attendance = None
        try:
            today_attendance = Attendance.objects.get(user=user, date=today)
            activity_logger.info(f"Attendance loaded for {user.username} on {today}")
        except Attendance.DoesNotExist:
            activity_logger.info(f"No attendance record found for {user.username} on {today}")
        
        # Recent notifications
        notifications = Notification.objects.filter(
            Q(recipients=user) | Q(is_global=True)
        ).order_by('-created_at')[:5]
        
        # Base context
        context = {
            'user': user,
            'user_tasks': user_tasks,
            'task_stats': task_stats,
            'today_attendance': today_attendance,
            'notifications': notifications,
            'today': today,
        }
        
        # Role-based additional data
        if hasattr(user, 'userprofile') and user.userprofile:
            user_profile = user.userprofile
            logger.info(f"Loading role-based data for {user.username} with role: {user_profile.role}")
            
            # Manager/Admin team data
            if user_profile.is_manager or user_profile.is_admin:
                team_tasks = Task.objects.filter(assigned_by=user).order_by('-created_at')[:5]
                team_stats = {
                    'total_projects': Project.objects.filter(created_by=user).count(),
                    'total_team_tasks': Task.objects.filter(assigned_by=user).count(),
                    'pending_tasks': Task.objects.filter(
                        assigned_by=user, 
                        status__in=['new', 'in_progress']
                    ).count(),
                    'completed_tasks': Task.objects.filter(
                        assigned_by=user, 
                        status='completed'
                    ).count(),
                }
                
                context.update({
                    'team_tasks': team_tasks,
                    'team_stats': team_stats,
                })
                
                activity_logger.info(f"Manager/Admin data loaded for {user.username}")
            
            # Admin-specific system-wide data
            if user_profile.is_admin:
                logger.info(f"Loading admin dashboard for {user.username}")
                
                # System-wide statistics
                total_users = User.objects.filter(is_active=True).count()
                total_projects = Project.objects.count()
                total_tasks = Task.objects.count()
                
                # User role breakdown
                user_roles = UserProfile.objects.values('role').annotate(count=Count('id'))
                role_stats = {role['role']: role['count'] for role in user_roles}
                
                # Task status breakdown (system-wide)
                task_status_stats = Task.objects.values('status').annotate(count=Count('id'))
                system_task_stats = {status['status']: status['count'] for status in task_status_stats}
                
                # Recent activity (last 7 days)
                week_ago = today - timedelta(days=7)
                recent_activity = {
                    'new_users': UserProfile.objects.filter(created_at__gte=week_ago).count(),
                    'new_projects': Project.objects.filter(created_at__gte=week_ago).count(),
                    'new_tasks': Task.objects.filter(created_at__gte=week_ago).count(),
                    'completed_tasks': Task.objects.filter(
                        completed_at__gte=week_ago,
                        status='completed'
                    ).count(),
                }
                
                # User access statistics - cải thiện theo yêu cầu
                online_users = User.objects.filter(
                    last_login__gte=timezone.now() - timedelta(hours=1),
                    is_active=True
                ).count()
                
                active_users_today = User.objects.filter(
                    last_login__gte=today,
                    is_active=True
                ).count()
                
                active_users_week = User.objects.filter(
                    last_login__gte=week_ago,
                    is_active=True
                ).count()
                
                # Chi tiết user đang hoạt động trong ngày
                active_users_detail = User.objects.filter(
                    last_login__gte=today,
                    is_active=True
                ).select_related('userprofile').order_by('-last_login')[:10]
                
                # System logs overview cơ bản - tối ưu theo yêu cầu
                log_stats = get_system_logs_overview()
                
                # Notification statistics
                notification_stats = {
                    'total_notifications': Notification.objects.count(),
                    'global_notifications': Notification.objects.filter(is_global=True).count(),
                    'recent_notifications': Notification.objects.filter(
                        created_at__gte=week_ago
                    ).count(),
                    'unread_notifications': Notification.objects.filter(
                        recipients=user,
                        is_read=False
                    ).count(),
                }
                
                # Recent notifications for admin
                recent_notifications = Notification.objects.all().order_by('-created_at')[:10]
                
                # Top performers (most completed tasks this month)
                current_month = today.replace(day=1)
                top_performers = User.objects.annotate(
                    completed_tasks_count=Count(
                        'assigned_tasks',
                        filter=Q(
                            assigned_tasks__status='completed',
                            assigned_tasks__completed_at__gte=current_month
                        )
                    )
                ).filter(completed_tasks_count__gt=0).order_by('-completed_tasks_count')[:5]
                
                # Attendance overview chi tiết theo yêu cầu - tình trạng trong ngày
                total_employees = User.objects.filter(
                    is_active=True, 
                    userprofile__role='user'
                ).exclude(userprofile__isnull=True).count()
                
                checked_in_today = Attendance.objects.filter(
                    date=today,
                    check_in__isnull=False
                ).count()
                
                checked_out_today = Attendance.objects.filter(
                    date=today,
                    check_out__isnull=False
                ).count()
                
                late_arrivals_today = Attendance.objects.filter(
                    date=today,
                    status='late'
                ).count()
                
                absent_today = total_employees - checked_in_today
                
                # Chi tiết attendance hôm nay với user details
                today_attendance_details = Attendance.objects.filter(
                    date=today
                ).select_related('user', 'user__userprofile').order_by('-check_in')[:10]
                
                # Calculate on-time arrivals
                on_time_arrivals = checked_in_today - late_arrivals_today
                
                attendance_summary = {
                    'total_employees': total_employees,
                    'checked_in': checked_in_today,
                    'checked_out': checked_out_today,
                    'still_working': checked_in_today - checked_out_today,
                    'late_arrivals': late_arrivals_today,
                    'absent': absent_today,
                    'on_time_arrivals': on_time_arrivals,
                    'attendance_rate': round((checked_in_today / total_employees * 100) if total_employees > 0 else 0, 1),
                    'on_time_rate': round((on_time_arrivals / total_employees * 100) if total_employees > 0 else 0, 1),
                }
                
                # Recent user activities - cải thiện hiển thị
                recent_users = User.objects.filter(
                    last_login__gte=week_ago,
                    last_login__isnull=False
                ).select_related('userprofile').order_by('-last_login')[:10]
                
                # Project progress chi tiết theo yêu cầu - tiến độ các dự án
                project_progress_detailed = []
                active_projects = Project.objects.filter(is_active=True).order_by('-created_at')
                
                for project in active_projects:
                    total_tasks = project.tasks.count()
                    completed_tasks = project.tasks.filter(status='completed').count()
                    in_progress_tasks = project.tasks.filter(status='in_progress').count()
                    overdue_tasks = project.tasks.filter(
                        deadline__lt=timezone.now(),
                        status__in=['new', 'in_progress']
                    ).count()
                    
                    progress_percentage = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
                    
                    # Project health score
                    health_score = 100
                    if overdue_tasks > 0:
                        health_score -= (overdue_tasks / total_tasks * 30) if total_tasks > 0 else 0
                    if progress_percentage < 20:
                        health_score -= 20
                    elif progress_percentage < 50:
                        health_score -= 10
                    
                    health_status = 'excellent' if health_score >= 90 else 'good' if health_score >= 70 else 'warning' if health_score >= 50 else 'danger'
                    
                    project_progress_detailed.append({
                        'project': project,
                        'total_tasks': total_tasks,
                        'completed_tasks': completed_tasks,
                        'in_progress_tasks': in_progress_tasks,
                        'overdue_tasks': overdue_tasks,
                        'progress': round(progress_percentage, 1),
                        'health_score': round(health_score, 1),
                        'health_status': health_status,
                        'team_size': project.tasks.values('assigned_to').distinct().count(),
                        'days_since_created': (today - project.created_at.date()).days,
                    })
                
                # Sort by health score descending
                project_progress_detailed.sort(key=lambda x: x['health_score'], reverse=True)
                
                # Limit to top 8 projects for display
                project_progress_detailed = project_progress_detailed[:8]
                
                # System logs cơ bản với summary metrics
                log_summary = {
                    'total_entries_today': 0,
                    'error_count_today': 0,
                    'login_attempts_today': 0,
                    'user_activities_today': 0,
                    'system_health': 'good',  # good/warning/critical
                }
                
                # Update log summary if logs are available
                if log_stats.get('total_entries', 0) > 0:
                    log_summary.update({
                        'total_entries_today': log_stats.get('total_entries', 0),
                        'error_count_today': log_stats.get('recent_errors', 0),
                        'login_attempts_today': log_stats.get('login_attempts', 0),
                        'user_activities_today': log_stats.get('user_activities', 0),
                    })
                    
                    # Determine system health
                    error_rate = (log_stats.get('recent_errors', 0) / log_stats.get('total_entries', 1)) * 100
                    if error_rate > 10:
                        log_summary['system_health'] = 'critical'
                    elif error_rate > 5:
                        log_summary['system_health'] = 'warning'
                    else:
                        log_summary['system_health'] = 'good'
                
                # Add admin context
                context.update({
                    'is_admin_dashboard': True,
                    'system_stats': {
                        'total_users': total_users,
                        'total_projects': total_projects,
                        'total_tasks': total_tasks,
                        'active_users_today': active_users_today,
                        'active_users_week': active_users_week,
                        'online_users': online_users,
                        'inactive_users': total_users - active_users_week,
                        'online_rate': round((online_users / total_users * 100) if total_users > 0 else 0, 1),
                        'daily_activity_rate': round((active_users_today / total_users * 100) if total_users > 0 else 0, 1),
                    },
                    'role_stats': role_stats,
                    'system_task_stats': system_task_stats,
                    'log_stats': log_stats,
                    'log_summary': log_summary,
                    'notification_stats': notification_stats,
                    'recent_notifications': recent_notifications,
                    'recent_activity': recent_activity,
                    'top_performers': top_performers,
                    'today_attendance_overview': attendance_summary,
                    'today_attendance_details': today_attendance_details,
                    'active_users_detail': active_users_detail,
                    'recent_users': recent_users,
                    'project_progress': project_progress_detailed,  # Detailed project progress
                })
                
                activity_logger.info(f"Admin dashboard fully loaded for {user.username} with {total_users} users, {total_projects} projects, {total_tasks} tasks, detailed project progress and attendance tracking")
        else:
            logger.warning(f"User {user.username} does not have UserProfile")
        
        logger.info(f"Dashboard loaded successfully for {user.username}")
        return render(request, 'dashboard/home.html', context)
        
    except Exception as e:
        logger.error(f"Error loading dashboard for {user.username}: {str(e)}")
        # Return basic context on error
        context = {
            'user': user,
            'user_tasks': [],
            'task_stats': {'total': 0, 'new': 0, 'in_progress': 0, 'completed': 0, 'overdue': 0},
            'today_attendance': None,
            'notifications': [],
            'today': today,
        }
        return render(request, 'dashboard/home.html', context)

@login_required
def view_logs(request):
    """System logs view for admin users only"""
    user = request.user
    
    # Check admin permission
    if not (hasattr(user, 'userprofile') and user.userprofile and user.userprofile.is_admin):
        messages.error(request, 'Access denied. Admin privileges required.')
        return redirect('dashboard:home')
    
    logger.info(f"System logs accessed by admin: {user.username}")
    
    try:
        # Get log file paths - fix path to point to correct debugs_project directory
        # Fixed path: debugs_project is in the project root, not in django_project  
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        log_dir = os.path.join(project_root, 'debugs_project')
        activity_log = os.path.join(log_dir, 'activity.log')
        error_log = os.path.join(log_dir, 'error.log')
        debug_log = os.path.join(log_dir, 'debug.log')
        
        logger.info(f"Log directory: {log_dir}")
        logger.info(f"Activity log exists: {os.path.exists(activity_log)}")
        logger.info(f"Error log exists: {os.path.exists(error_log)}")
        logger.info(f"Debug log exists: {os.path.exists(debug_log)}")
        
        # Parse log files
        log_data = {
            'activity_logs': parse_log_file(activity_log, 'activity'),
            'error_logs': parse_log_file(error_log, 'error'),
            'debug_logs': parse_log_file(debug_log, 'debug'),
        }
        
        # DEBUG: Print what we got
        logger.info(f"Activity logs parsed: {len(log_data['activity_logs'])}")
        logger.info(f"Error logs parsed: {len(log_data['error_logs'])}")
        logger.info(f"Debug logs parsed: {len(log_data['debug_logs'])}")
        
        # Get log statistics - fix to handle the new log_data structure
        all_logs = []
        for log_type, logs in log_data.items():
            all_logs.extend(logs)
        
        log_stats = get_log_statistics(all_logs)
        
        logger.info(f"Parsed {len(all_logs)} total log entries")
        
        # DEBUG: If no activity logs found, let's debug with a simple test
        if len(log_data['activity_logs']) == 0 and os.path.exists(activity_log):
            logger.info("No activity logs parsed, testing manually...")
            try:
                with open(activity_log, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                logger.info(f"Activity log has {len(lines)} total lines")
                if lines:
                    logger.info(f"First line: {lines[0].strip()}")
                    logger.info(f"Last line: {lines[-1].strip()}")
                    # Test parse first line
                    test_parse = parse_log_line(lines[0].strip(), 'activity')
                    logger.info(f"Test parse result: {test_parse}")
            except Exception as e:
                logger.error(f"Error reading activity log manually: {e}")
        
        context = {
            'log_data': log_data,
            'log_stats': log_stats,
            'log_files': {
                'activity': activity_log,
                'error': error_log,
                'debug': debug_log,
            }
        }
        
        return render(request, 'dashboard/logs.html', context)
        
    except Exception as e:
        logger.error(f"Error in view_logs for {user.username}: {str(e)}")
        messages.error(request, f"Error loading system logs: {str(e)}")
        return redirect('dashboard:home')

def parse_log_file(log_path, log_type):
    """Parse log file and return structured data"""
    logs = []
    
    if not os.path.exists(log_path):
        logger.warning(f"Log file not found: {log_path}")
        return logs
    
    try:
        # Check file size first
        file_size = os.path.getsize(log_path)
        logger.info(f"Reading log file {log_path} (size: {file_size} bytes)")
        
        if file_size == 0:
            logger.info(f"Log file {log_path} is empty")
            return logs
            
        with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
            
        logger.info(f"Read {len(lines)} total lines from {log_path}")
        
        if not lines:
            logger.info(f"No lines found in {log_path}")
            return logs
            
        # Get last 100 lines
        recent_lines = lines[-100:] if len(lines) > 100 else lines
        logger.info(f"Processing {len(recent_lines)} recent lines from {log_path}")
        
        parsed_count = 0
        failed_count = 0
        for line_num, line in enumerate(recent_lines, 1):
            line = line.strip()
            if not line or line.startswith('#'):
                continue
                
            # Parse log line
            log_entry = parse_log_line(line, log_type)
            if log_entry:
                logs.append(log_entry)
                parsed_count += 1
            else:
                failed_count += 1
                logger.debug(f"Failed to parse line {line_num}: {line[:50]}...")
                
        logger.info(f"Successfully parsed {parsed_count} entries from {log_path} (failed: {failed_count})")
        
        # If no entries parsed but file has content, add sample entry
        if parsed_count == 0 and lines:
            logger.warning(f"No entries parsed from {log_path}, adding sample entry")
            logs.append({
                'level': 'INFO',
                'timestamp': timezone.now().strftime('%Y-%m-%d %H:%M:%S'),
                'message': f"Log parsing completed - {len(lines)} total lines in file",
                'type': log_type
            })
                
    except Exception as e:
        logger.error(f"Error parsing log file {log_path}: {str(e)}")
        # Add error entry
        logs.append({
            'level': 'ERROR',
            'timestamp': timezone.now().strftime('%Y-%m-%d %H:%M:%S'),
            'message': f"Error reading log file {log_path}: {str(e)}",
            'type': log_type
        })
    
    return logs

def parse_log_line(line, log_type):
    """Parse individual log line"""
    try:
        # Debug the line being processed
        logger.debug(f"Parsing line: {line[:100]}...")  # First 100 chars
        
        # Common log format: LEVEL YYYY-MM-DD HH:MM:SS,mmm message
        # Actual format from activity.log: INFO 2025-06-27 17:14:46,686 Dashboard accessed by user: admin...
        
        # More flexible regex that handles different log formats
        patterns = [
            # Pattern 1: LEVEL YYYY-MM-DD HH:MM:SS,mmm message
            r'(\w+)\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}),(\d+)\s+(.+)',
            # Pattern 2: YYYY-MM-DD HH:MM:SS,mmm LEVEL message  
            r'(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}),(\d+)\s+(\w+)\s+(.+)',
            # Pattern 3: Simple format - LEVEL: message
            r'(\w+):\s*(.+)',
        ]
        
        for pattern in patterns:
            match = re.match(pattern, line)
            if match:
                groups = match.groups()
                if len(groups) == 4:
                    level, timestamp, milliseconds, message = groups
                    result = {
                        'level': level,
                        'timestamp': f"{timestamp}.{milliseconds}",
                        'message': message,
                        'type': log_type
                    }
                elif len(groups) == 2:
                    level, message = groups
                    result = {
                        'level': level,
                        'timestamp': timezone.now().strftime('%Y-%m-%d %H:%M:%S'),
                        'message': message,
                        'type': log_type
                    }
                else:
                    continue
                    
                logger.debug(f"Successfully parsed: {result['level']} - {result['message'][:50]}...")
                return result
        
        # Fallback for unparseable lines
        logger.debug(f"Could not parse line, using fallback: {line[:50]}...")
        return {
            'level': 'INFO',
            'timestamp': timezone.now().strftime('%Y-%m-%d %H:%M:%S'),
            'message': line,
            'type': log_type
        }
            
    except Exception as e:
        logger.error(f"Error parsing log line: {str(e)}")
        # Return fallback entry instead of None
        return {
            'level': 'ERROR',
            'timestamp': timezone.now().strftime('%Y-%m-%d %H:%M:%S'),
            'message': f"Parse error: {line[:100]}",
            'type': log_type
        }

def get_log_statistics(log_data):
    """Calculate statistics from log data"""
    stats = {
        'total_entries': len(log_data),
        'error_count': 0,
        'login_attempts': 0,
        'user_activities': 0,
        'recent_errors': 0,
        'system_events': 0,
    }
    
    for entry in log_data:
        if entry.get('level') == 'ERROR':
            stats['error_count'] += 1
        if 'login' in entry.get('message', '').lower():
            stats['login_attempts'] += 1
        if 'user' in entry.get('message', '').lower():
            stats['user_activities'] += 1
        if 'system' in entry.get('message', '').lower():
            stats['system_events'] += 1
    
    # Count recent errors (last 24 hours)
    yesterday = timezone.now() - timedelta(days=1)
    for entry in log_data:
        if entry.get('level') == 'ERROR' and entry.get('timestamp'):
            try:
                entry_time = datetime.fromisoformat(entry['timestamp'].replace('Z', '+00:00'))
                if entry_time >= yesterday:
                    stats['recent_errors'] += 1
            except:
                pass
    
    return stats

def get_system_logs_overview():
    """Get system logs overview statistics"""
    try:
        # Get log file paths - fix path to point to correct debugs_project directory
        # Fixed path: debugs_project is in the project root, not in django_project  
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        log_dir = os.path.join(project_root, 'debugs_project')
        activity_log = os.path.join(log_dir, 'activity.log')
        error_log = os.path.join(log_dir, 'error.log')
        debug_log = os.path.join(log_dir, 'debug.log')
        
        log_stats = {
            'total_entries': 0,
            'error_count': 0,
            'login_attempts': 0,
            'user_activities': 0,
            'recent_errors': 0,
            'system_events': 0,
            'log_files_status': {
                'activity': os.path.exists(activity_log),
                'error': os.path.exists(error_log),
                'debug': os.path.exists(debug_log),
            }
        }
        
        # Parse activity log
        if os.path.exists(activity_log):
            activity_data = parse_log_file(activity_log, 'activity')
            activity_stats = get_log_statistics(activity_data)
            log_stats['total_entries'] += activity_stats['total_entries']
            log_stats['login_attempts'] += activity_stats['login_attempts']
            log_stats['user_activities'] += activity_stats['user_activities']
        
        # Parse error log
        if os.path.exists(error_log):
            error_data = parse_log_file(error_log, 'error')
            error_stats = get_log_statistics(error_data)
            log_stats['total_entries'] += error_stats['total_entries']
            log_stats['error_count'] += error_stats['error_count']
            log_stats['recent_errors'] += error_stats['recent_errors']
        
        # Parse debug log
        if os.path.exists(debug_log):
            debug_data = parse_log_file(debug_log, 'debug')
            debug_stats = get_log_statistics(debug_data)
            log_stats['total_entries'] += debug_stats['total_entries']
            log_stats['system_events'] += debug_stats['system_events']
        
        return log_stats
        
    except Exception as e:
        logger.error(f"Error getting system logs overview: {e}")
        return {
            'total_entries': 0,
            'error_count': 0,
            'login_attempts': 0,
            'user_activities': 0,
            'recent_errors': 0,
            'system_events': 0,
            'log_files_status': {
                'activity': False,
                'error': False,
                'debug': False,
            }
        } 
    

