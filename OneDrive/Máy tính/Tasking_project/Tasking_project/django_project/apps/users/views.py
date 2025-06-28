from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.db.models import Q
from django.core.paginator import Paginator
from apps.authentication.models import UserProfile
import logging

# Get logger for this module
logger = logging.getLogger('apps')
user_logger = logging.getLogger('apps.users')

@login_required
def profile(request):
    """User profile view and edit"""
    user = request.user
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    user_logger.info(f"Profile accessed by {user.username}")
    
    if request.method == 'POST':
        # Update user basic info
        old_email = user.email
        user.first_name = request.POST.get('first_name', '')
        user.last_name = request.POST.get('last_name', '')
        user.email = request.POST.get('email', '')
        user.save()
        
        # Update profile info
        profile.phone = request.POST.get('phone', '')
        profile.department = request.POST.get('department', '')
        profile.position = request.POST.get('position', '')
        
        # Handle avatar upload
        if 'avatar' in request.FILES:
            profile.avatar = request.FILES['avatar']
        
        profile.save()
        
        user_logger.info(f"Profile updated by {user.username}: email {old_email} -> {user.email}")
        messages.success(request, 'Profile updated successfully!')
        return redirect('users:profile')
    
    context = {
        'user': user,
        'profile': profile,
    }
    return render(request, 'users/profile.html', context)

@login_required
def change_password(request):
    """Change password view"""
    user_logger.info(f"Password change requested by {request.user.username}")
    
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # Important!
            messages.success(request, 'Your password was successfully updated!')
            user_logger.info(f"Password changed successfully for {request.user.username}")
            return redirect('users:profile')
        else:
            user_logger.warning(f"Password change failed for {request.user.username}: validation errors")
            for error in form.errors.values():
                messages.error(request, error)
    else:
        form = PasswordChangeForm(request.user)
    
    return render(request, 'users/change_password.html', {'form': form})

@login_required
def user_list(request):
    """User management - for admins/managers only"""
    current_user = request.user
    
    user_logger.info(f"User list accessed by {current_user.username}")
    
    if not (hasattr(current_user, 'userprofile') and 
            (current_user.userprofile.is_manager or current_user.userprofile.is_admin)):
        messages.error(request, "You don't have permission to manage users.")
        user_logger.warning(f"Unauthorized user list access attempt by {current_user.username}")
        return redirect('users:profile')
    
    # Search functionality
    search_query = request.GET.get('search', '')
    role_filter = request.GET.get('role', '')
    status_filter = request.GET.get('status', 'active')  # Default to active users
    
    users = User.objects.select_related('userprofile').order_by('username')
    
    # Apply filters
    if search_query:
        users = users.filter(
            Q(username__icontains=search_query) |
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query) |
            Q(email__icontains=search_query)
        )
    
    if role_filter:
        users = users.filter(userprofile__role=role_filter)
    
    if status_filter == 'active':
        users = users.filter(is_active=True)
    elif status_filter == 'inactive':
        users = users.filter(is_active=False)
    # If status_filter is empty or 'all', show all users
    
    # Pagination
    paginator = Paginator(users, 10)  # Show 10 users per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    user_logger.info(f"User list loaded by {current_user.username}: {users.count()} users found (status: {status_filter})")
    
    context = {
        'page_obj': page_obj,
        'search_query': search_query,
        'role_filter': role_filter,
        'status_filter': status_filter,
        'role_choices': UserProfile.ROLE_CHOICES,
    }
    return render(request, 'users/user_list.html', context)

@login_required
def user_detail(request, pk):
    """User detail view - for admins/managers only"""
    current_user = request.user
    
    if not (hasattr(current_user, 'userprofile') and 
            (current_user.userprofile.is_manager or current_user.userprofile.is_admin)):
        messages.error(request, "You don't have permission to view user details.")
        user_logger.warning(f"Unauthorized user detail access attempt by {current_user.username}")
        return redirect('users:profile')
    
    user = get_object_or_404(User, pk=pk)
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    user_logger.info(f"User detail viewed by {current_user.username} for user {user.username}")
    
    # Get user's recent tasks and attendance
    from apps.tasks.models import Task
    from apps.attendance.models import Attendance
    
    recent_tasks = Task.objects.filter(assigned_to=user).order_by('-created_at')[:5]
    recent_attendance = Attendance.objects.filter(user=user).order_by('-date')[:5]
    
    # Calculate statistics
    task_stats = {
        'total': Task.objects.filter(assigned_to=user).count(),
        'completed': Task.objects.filter(assigned_to=user, status='completed').count(),
        'in_progress': Task.objects.filter(assigned_to=user, status='in_progress').count(),
    }
    
    # This month attendance
    from datetime import datetime
    current_month = datetime.now().replace(day=1).date()
    monthly_attendance = Attendance.objects.filter(
        user=user,
        date__gte=current_month
    ).count()
    
    context = {
        'viewed_user': user,
        'profile': profile,
        'recent_tasks': recent_tasks,
        'recent_attendance': recent_attendance,
        'task_stats': task_stats,
        'monthly_attendance': monthly_attendance,
    }
    return render(request, 'users/user_detail.html', context)

@login_required
def add_user(request):
    """Add new user - for admins only"""
    current_user = request.user
    
    user_logger.info(f"Add user page accessed by {current_user.username}")
    
    if not (hasattr(current_user, 'userprofile') and current_user.userprofile.is_admin):
        messages.error(request, "You don't have permission to add users.")
        user_logger.warning(f"Unauthorized add user access attempt by {current_user.username}")
        return redirect('users:user_list')
    
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        first_name = request.POST.get('first_name', '').strip()
        last_name = request.POST.get('last_name', '').strip()
        password = request.POST.get('password', '')
        role = request.POST.get('role', 'user')
        department = request.POST.get('department', '').strip()
        position = request.POST.get('position', '').strip()
        phone = request.POST.get('phone', '').strip()
        
        # Validation
        if not username or not email or not password:
            messages.error(request, 'Username, email, and password are required.')
            user_logger.warning(f"User creation failed by {current_user.username}: missing required fields")
        elif User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            user_logger.warning(f"User creation failed by {current_user.username}: username {username} already exists")
        elif User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists.')
            user_logger.warning(f"User creation failed by {current_user.username}: email {email} already exists")
        else:
            try:
                # Create user
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )
                
                # Create profile
                profile = UserProfile.objects.create(
                    user=user,
                    role=role,
                    department=department,
                    position=position,
                    phone=phone
                )
                
                messages.success(request, f'User {username} created successfully!')
                user_logger.info(f"New user created by {current_user.username}: {username} ({first_name} {last_name}) with role {role}")
                return redirect('users:user_detail', pk=user.pk)
                
            except Exception as e:
                messages.error(request, f'Error creating user: {str(e)}')
                logger.error(f"User creation error by {current_user.username}: {str(e)}")
    
    context = {
        'role_choices': UserProfile.ROLE_CHOICES,
    }
    return render(request, 'users/add_user.html', context)

@login_required
def edit_user(request, pk):
    """Edit user - for admins only"""
    current_user = request.user
    
    if not (hasattr(current_user, 'userprofile') and current_user.userprofile.is_admin):
        messages.error(request, "You don't have permission to edit users.")
        user_logger.warning(f"Unauthorized edit user access attempt by {current_user.username}")
        return redirect('users:user_list')
    
    user = get_object_or_404(User, pk=pk)
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    user_logger.info(f"Edit user page accessed by {current_user.username} for user {user.username}")
    
    if request.method == 'POST':
        # Store old values for logging
        old_role = profile.role
        old_active = user.is_active
        old_email = user.email
        
        # Update user basic info
        user.first_name = request.POST.get('first_name', '')
        user.last_name = request.POST.get('last_name', '')
        user.email = request.POST.get('email', '')
        user.is_active = request.POST.get('is_active') == 'on'
        user.save()
        
        # Update profile info
        profile.role = request.POST.get('role', 'user')
        profile.phone = request.POST.get('phone', '')
        profile.department = request.POST.get('department', '')
        profile.position = request.POST.get('position', '')
        
        hire_date = request.POST.get('hire_date')
        if hire_date:
            profile.hire_date = hire_date
        
        profile.save()
        
        # Log changes
        changes = []
        if old_role != profile.role:
            changes.append(f"role: {old_role} -> {profile.role}")
        if old_active != user.is_active:
            changes.append(f"active: {old_active} -> {user.is_active}")
        if old_email != user.email:
            changes.append(f"email: {old_email} -> {user.email}")
        
        change_log = ", ".join(changes) if changes else "profile info"
        user_logger.info(f"User {user.username} updated by {current_user.username}: {change_log}")
        
        messages.success(request, f'User {user.username} updated successfully!')
        return redirect('users:user_detail', pk=pk)
    
    context = {
        'edited_user': user,
        'profile': profile,
        'role_choices': UserProfile.ROLE_CHOICES,
    }
    return render(request, 'users/edit_user.html', context)

@login_required
def delete_user(request, pk):
    """Delete user - for admins only"""
    current_user = request.user
    
    if not (hasattr(current_user, 'userprofile') and current_user.userprofile.is_admin):
        messages.error(request, "You don't have permission to delete users.")
        user_logger.warning(f"Unauthorized delete user access attempt by {current_user.username}")
        return redirect('users:user_list')
    
    user = get_object_or_404(User, pk=pk)
    
    # Prevent self-deletion
    if user == current_user:
        messages.error(request, "You cannot delete your own account.")
        user_logger.warning(f"Self-deletion attempt by {current_user.username}")
        return redirect('users:user_list')
    
    if request.method == 'POST':
        username = user.username
        full_name = user.get_full_name()
        
        # Soft delete (deactivate) instead of hard delete to preserve data integrity
        user.is_active = False
        user.save()
        
        messages.success(request, f'User {username} has been deactivated successfully!')
        user_logger.info(f"User {username} ({full_name}) deactivated by {current_user.username}")
        return redirect('users:user_list')
    
    user_logger.info(f"Delete user confirmation page viewed by {current_user.username} for user {user.username}")
    
    context = {
        'user_to_delete': user,
    }
    return render(request, 'users/delete_user.html', context)

@login_required
def reactivate_user(request, pk):
    """Reactivate user - for admins only"""
    current_user = request.user
    
    if not (hasattr(current_user, 'userprofile') and current_user.userprofile.is_admin):
        messages.error(request, "You don't have permission to reactivate users.")
        user_logger.warning(f"Unauthorized reactivate user access attempt by {current_user.username}")
        return redirect('users:user_list')
    
    user = get_object_or_404(User, pk=pk)
    
    if request.method == 'POST':
        username = user.username
        full_name = user.get_full_name()
        
        # Reactivate user
        user.is_active = True
        user.save()
        
        messages.success(request, f'User {username} has been reactivated successfully!')
        user_logger.info(f"User {username} ({full_name}) reactivated by {current_user.username}")
        return redirect('users:user_list')
    
    user_logger.info(f"Reactivate user confirmation page viewed by {current_user.username} for user {user.username}")
    
    context = {
        'user_to_reactivate': user,
    }
    return render(request, 'users/reactivate_user.html', context)

@login_required
def reset_user_password(request, pk):
    """Reset user password - for admins only"""
    current_user = request.user
    
    if not (hasattr(current_user, 'userprofile') and current_user.userprofile.is_admin):
        messages.error(request, "You don't have permission to reset passwords.")
        user_logger.warning(f"Unauthorized password reset access attempt by {current_user.username}")
        return redirect('users:user_list')
    
    user = get_object_or_404(User, pk=pk)
    
    if request.method == 'POST':
        new_password = request.POST.get('new_password', '')
        confirm_password = request.POST.get('confirm_password', '')
        
        if not new_password or len(new_password) < 8:
            messages.error(request, 'Password must be at least 8 characters long.')
        elif new_password != confirm_password:
            messages.error(request, 'Passwords do not match.')
        else:
            user.set_password(new_password)
            user.save()
            
            messages.success(request, f'Password reset successfully for {user.username}!')
            user_logger.info(f"Password reset for user {user.username} by admin {current_user.username}")
            return redirect('users:user_detail', pk=pk)
    
    user_logger.info(f"Password reset page accessed by {current_user.username} for user {user.username}")
    
    context = {
        'target_user': user,
    }
    return render(request, 'users/reset_password.html', context)

@login_required
def hard_delete_user(request, pk):
    """Hard delete user - permanently remove from database - for admins only"""
    current_user = request.user
    
    if not (hasattr(current_user, 'userprofile') and current_user.userprofile.is_admin):
        messages.error(request, "You don't have permission to permanently delete users.")
        user_logger.warning(f"Unauthorized hard delete user access attempt by {current_user.username}")
        return redirect('users:user_list')
    
    user = get_object_or_404(User, pk=pk)
    
    # Prevent self-deletion
    if user == current_user:
        messages.error(request, "You cannot delete your own account.")
        user_logger.warning(f"Self-deletion attempt by {current_user.username}")
        return redirect('users:user_list')
    
    # Prevent deletion of other admins (safety measure)
    if hasattr(user, 'userprofile') and user.userprofile.role == 'admin':
        messages.error(request, "Cannot permanently delete admin accounts for security reasons.")
        user_logger.warning(f"Admin deletion attempt by {current_user.username} for user {user.username}")
        return redirect('users:user_list')
    
    if request.method == 'POST':
        username = user.username
        full_name = user.get_full_name()
        email = user.email
        
        try:
            # Store user info for logging before deletion
            user_info = {
                'username': username,
                'full_name': full_name,
                'email': email,
                'role': user.userprofile.role if hasattr(user, 'userprofile') else 'unknown',
                'date_joined': user.date_joined,
                'last_login': user.last_login,
            }
            
            # Hard delete - permanently remove from database
            user.delete()
            
            messages.success(request, f'User {username} has been permanently deleted from the system!')
            user_logger.warning(f"User {username} ({full_name}) PERMANENTLY DELETED by {current_user.username}. User info: {user_info}")
            return redirect('users:user_list')
            
        except Exception as e:
            messages.error(request, f'Error deleting user: {str(e)}')
            user_logger.error(f"Hard delete error by {current_user.username} for user {username}: {str(e)}")
            return redirect('users:user_detail', pk=pk)
    
    user_logger.info(f"Hard delete user confirmation page viewed by {current_user.username} for user {user.username}")
    
    context = {
        'user_to_delete': user,
    }
    return render(request, 'users/hard_delete_user.html', context) 