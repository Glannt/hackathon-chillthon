from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.db.models import Sum, Count, Q
from django.core.paginator import Paginator
from datetime import datetime, timedelta
from .models import Attendance, AttendanceSummary
import logging
import json

# Get logger for this module
logger = logging.getLogger('attendance')
activity_logger = logging.getLogger('apps.attendance')

@login_required
def attendance_dashboard(request):
    """Main attendance dashboard with optimized loading"""
    user = request.user
    today = timezone.now().date()
    
    logger.info(f"Attendance dashboard accessed by {user.username}")
    
    # Get today's attendance - optimized query
    today_attendance = Attendance.objects.filter(user=user, date=today).first()
    if today_attendance:
        activity_logger.info(f"Today's attendance found for {user.username}: {today_attendance.status}")
    else:
        activity_logger.info(f"No attendance record for {user.username} on {today}")
    
    # Get recent attendance records - limit to 5 for faster loading
    recent_attendance = Attendance.objects.filter(user=user).order_by('-date')[:5]
    
    # Monthly statistics - fix FieldError by removing Sum('worked_hours')
    current_month = today.replace(day=1)
    monthly_attendance = Attendance.objects.filter(
        user=user,
        date__gte=current_month
    )
    
    # Calculate stats manually since worked_hours is a property
    monthly_stats = {
        'total_days': monthly_attendance.count(),
        'present_days': monthly_attendance.filter(status__in=['present', 'late']).count(),
        'total_hours': sum([att.worked_hours for att in monthly_attendance if att.worked_hours])
    }
    
    logger.info(f"Monthly stats loaded for {user.username}: {monthly_stats}")
    
    context = {
        'today_attendance': today_attendance,
        'recent_attendance': recent_attendance,
        'monthly_stats': monthly_stats,
        'today': today,
    }
    return render(request, 'attendance/dashboard.html', context)

@login_required
@require_http_methods(["POST"])
def check_in(request):
    """Optimized check-in with AJAX support and better logic"""
    user = request.user
    today = timezone.now().date()
    now = timezone.now()
    
    logger.info(f"Check-in attempt by {user.username} at {now}")
    
    try:
        # Check if already has attendance record today
        attendance = Attendance.objects.filter(user=user, date=today).first()
        
        if attendance and attendance.check_in:
            # Already checked in
            message = 'You have already checked in today!'
            logger.warning(f"Duplicate check-in attempt by {user.username}")
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': message,
                    'already_checked_in': True,
                    'check_in_time': attendance.check_in.strftime('%H:%M')
                })
            else:
                messages.warning(request, message)
                return redirect('attendance:dashboard')
        
        # Create or update attendance record
        if not attendance:
            attendance = Attendance.objects.create(
                user=user,
                date=today,
                check_in=now,
                status='present'  # Default to present, will be updated by model save
            )
            created = True
        else:
            attendance.check_in = now
            attendance.save()
            created = False
        
        success_message = f'Checked in successfully at {now.strftime("%H:%M")}!'
        activity_logger.info(f"User {user.username} checked in at {now.strftime('%H:%M')} on {today}")
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True,
                'message': success_message,
                'check_in_time': now.strftime('%H:%M'),
                'status': attendance.get_status_display(),
                'is_late': attendance.is_late,
                'redirect_url': request.path
            })
        else:
            messages.success(request, success_message)
            return redirect('attendance:dashboard')
            
    except Exception as e:
        error_message = f'Error during check-in: {str(e)}'
        logger.error(f"Check-in error for {user.username}: {str(e)}")
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': False,
                'message': error_message,
                'error': True
            })
        else:
            messages.error(request, error_message)
            return redirect('attendance:dashboard')

@login_required
@require_http_methods(["POST"])
def check_out(request):
    """Optimized check-out with AJAX support and better logic"""
    user = request.user
    today = timezone.now().date()
    now = timezone.now()
    
    logger.info(f"Check-out attempt by {user.username} at {now}")
    
    try:
        attendance = Attendance.objects.filter(user=user, date=today).first()
        
        if not attendance:
            error_message = 'No attendance record found for today! Please check in first.'
            logger.error(f"Check-out attempted but no attendance record found for {user.username} on {today}")
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': error_message,
                    'no_check_in': True
                })
            else:
                messages.error(request, error_message)
                return redirect('attendance:dashboard')
        
        if not attendance.check_in:
            error_message = 'You need to check in first!'
            logger.warning(f"Check-out attempted without check-in by {user.username}")
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': error_message,
                    'no_check_in': True
                })
            else:
                messages.error(request, error_message)
                return redirect('attendance:dashboard')
        
        if attendance.check_out:
            error_message = 'You have already checked out today!'
            logger.warning(f"Duplicate check-out attempt by {user.username}")
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': error_message,
                    'already_checked_out': True,
                    'check_out_time': attendance.check_out.strftime('%H:%M'),
                    'worked_hours': attendance.worked_hours_display
                })
            else:
                messages.warning(request, error_message)
                return redirect('attendance:dashboard')
        
        # Perform check-out
        attendance.check_out = now
        attendance.save()
        
        success_message = (f'Checked out successfully at {now.strftime("%H:%M")}! '
                          f'Total hours: {attendance.worked_hours_display}')
        activity_logger.info(f"User {user.username} checked out at {now.strftime('%H:%M')} on {today}. "
                           f"Total hours: {attendance.worked_hours_display}")
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True,
                'message': success_message,
                'check_out_time': now.strftime('%H:%M'),
                'worked_hours': attendance.worked_hours_display,
                'total_time': str(attendance.worked_hours),
                'status': attendance.get_status_display(),
                'redirect_url': request.path
            })
        else:
            messages.success(request, success_message)
            return redirect('attendance:dashboard')
            
    except Exception as e:
        error_message = f'Error during check-out: {str(e)}'
        logger.error(f"Check-out error for {user.username}: {str(e)}")
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': False,
                'message': error_message,
                'error': True
            })
        else:
            messages.error(request, error_message)
            return redirect('attendance:dashboard')

@login_required
def get_attendance_status(request):
    """AJAX endpoint to get current attendance status"""
    user = request.user
    today = timezone.now().date()
    
    try:
        attendance = Attendance.objects.filter(user=user, date=today).first()
        
        if attendance:
            return JsonResponse({
                'success': True,
                'has_attendance': True,
                'check_in': attendance.check_in.strftime('%H:%M') if attendance.check_in else None,
                'check_out': attendance.check_out.strftime('%H:%M') if attendance.check_out else None,
                'status': attendance.get_status_display(),
                'worked_hours': attendance.worked_hours_display if attendance.worked_hours else None,
                'is_late': attendance.is_late,
                'can_check_in': not bool(attendance.check_in),
                'can_check_out': bool(attendance.check_in) and not bool(attendance.check_out)
            })
        else:
            return JsonResponse({
                'success': True,
                'has_attendance': False,
                'can_check_in': True,
                'can_check_out': False
            })
            
    except Exception as e:
        logger.error(f"Error getting attendance status for {user.username}: {str(e)}")
        return JsonResponse({
            'success': False,
            'message': f'Error getting attendance status: {str(e)}'
        })

@login_required
def attendance_history(request):
    """View attendance history"""
    user = request.user
    month = request.GET.get('month')
    year = request.GET.get('year')
    
    logger.info(f"Attendance history requested by {user.username} for month: {month}, year: {year}")
    
    # Default to current month if not specified
    if not month or not year:
        today = timezone.now().date()
        month = today.month
        year = today.year
    else:
        month = int(month)
        year = int(year)
    
    # Get attendance records for the specified month
    start_date = datetime(year, month, 1).date()
    if month == 12:
        end_date = datetime(year + 1, 1, 1).date()
    else:
        end_date = datetime(year, month + 1, 1).date()
    
    attendance_records = Attendance.objects.filter(
        user=user,
        date__gte=start_date,
        date__lt=end_date
    ).order_by('-date')
    
    # Calculate statistics
    stats = {
        'total_days': attendance_records.count(),
        'present_days': attendance_records.filter(status__in=['present', 'late']).count(),
        'absent_days': attendance_records.filter(status='absent').count(),
        'late_days': attendance_records.filter(status='late').count(),
        'total_hours': sum([att.worked_hours for att in attendance_records if att.worked_hours]),
    }
    
    activity_logger.info(f"Attendance history loaded for {user.username}: {stats['total_days']} days in {month}/{year}")
    
    context = {
        'attendance_records': attendance_records,
        'stats': stats,
        'current_month': month,
        'current_year': year,
        'month_name': datetime(year, month, 1).strftime('%B'),
    }
    return render(request, 'attendance/history.html', context)

@login_required
def team_attendance(request):
    """Team attendance overview - for managers/admins only"""
    user = request.user
    
    logger.info(f"Team attendance requested by {user.username}")
    
    if not (hasattr(user, 'userprofile') and 
            (user.userprofile.is_manager or user.userprofile.is_admin)):
        messages.error(request, "You don't have permission to view team attendance.")
        logger.warning(f"Unauthorized team attendance access attempt by {user.username}")
        return redirect('attendance:dashboard')
    
    # Get date from request or use today
    date_str = request.GET.get('date')
    if date_str:
        try:
            today = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            today = timezone.now().date()
    else:
        today = timezone.now().date()
    
    # Get today's attendance for all users
    today_attendance = Attendance.objects.filter(date=today).select_related('user')
    
    # Get all users with their attendance status
    from django.contrib.auth.models import User
    from apps.authentication.models import UserProfile
    
    all_users = User.objects.filter(
        is_active=True,
        userprofile__role__in=['user', 'manager']
    ).select_related('userprofile')
    
    # Filter by department if specified
    department = request.GET.get('department')
    if department:
        all_users = all_users.filter(userprofile__department=department)
    
    user_attendance = []
    present_count = 0
    late_count = 0
    absent_count = 0
    
    for u in all_users:
        try:
            att = today_attendance.get(user=u)
            if att.status == 'present':
                present_count += 1
            elif att.status == 'late':
                late_count += 1
            elif att.status == 'absent':
                absent_count += 1
        except Attendance.DoesNotExist:
            att = None
            absent_count += 1
        
        user_attendance.append({
            'user': u,
            'attendance': att,
        })
    
    activity_logger.info(f"Team attendance loaded by {user.username} for {len(user_attendance)} users on {today}")
    
    context = {
        'user_attendance': user_attendance,
        'today': today,
        'present_count': present_count,
        'late_count': late_count,
        'absent_count': absent_count,
    }
    return render(request, 'attendance/team_attendance.html', context)

@login_required
def attendance_list(request):
    """View all attendance records - for admins only"""
    user = request.user
    
    logger.info(f"Attendance list requested by {user.username}")
    
    if not (hasattr(user, 'userprofile') and user.userprofile.is_admin):
        messages.error(request, "You don't have permission to view all attendance records.")
        logger.warning(f"Unauthorized attendance list access attempt by {user.username}")
        return redirect('attendance:dashboard')
    
    # Get filter parameters
    user_filter = request.GET.get('user', '')
    date_from = request.GET.get('date_from', '')
    date_to = request.GET.get('date_to', '')
    status_filter = request.GET.get('status', '')
    department_filter = request.GET.get('department', '')
    
    # Build query
    attendance_query = Attendance.objects.select_related('user', 'user__userprofile').order_by('-date', '-check_in')
    
    # Apply filters
    if user_filter:
        attendance_query = attendance_query.filter(user__username__icontains=user_filter)
    
    if date_from:
        try:
            date_from_obj = datetime.strptime(date_from, '%Y-%m-%d').date()
            attendance_query = attendance_query.filter(date__gte=date_from_obj)
        except ValueError:
            pass
    
    if date_to:
        try:
            date_to_obj = datetime.strptime(date_to, '%Y-%m-%d').date()
            attendance_query = attendance_query.filter(date__lte=date_to_obj)
        except ValueError:
            pass
    
    if status_filter:
        attendance_query = attendance_query.filter(status=status_filter)
    
    if department_filter:
        attendance_query = attendance_query.filter(user__userprofile__department=department_filter)
    
    # Pagination
    paginator = Paginator(attendance_query, 25)  # 25 records per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get statistics - fix performance issue by evaluating queryset for page only
    total_records = attendance_query.count()
    total_users = attendance_query.values('user').distinct().count()
    # Calculate total_hours for current page only to avoid performance issues
    total_hours = sum([att.worked_hours for att in page_obj if att.worked_hours])
    
    # Get unique departments for filter dropdown
    from apps.authentication.models import UserProfile
    departments = UserProfile.objects.values_list('department', flat=True).distinct().exclude(department='')
    
    # Get all users for filter dropdown
    from django.contrib.auth.models import User
    all_users = User.objects.filter(is_active=True).values_list('username', flat=True)
    
    activity_logger.info(f"Attendance list loaded by {user.username}: {total_records} records, {total_users} users")
    
    context = {
        'page_obj': page_obj,
        'total_records': total_records,
        'total_users': total_users,
        'total_hours': total_hours,
        'departments': departments,
        'all_users': all_users,
        'filters': {
            'user': user_filter,
            'date_from': date_from,
            'date_to': date_to,
            'status': status_filter,
            'department': department_filter,
        }
    }
    return render(request, 'attendance/attendance_list.html', context)