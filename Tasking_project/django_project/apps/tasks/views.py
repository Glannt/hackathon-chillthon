from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.db.models import Q, Count, Avg
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.paginator import Paginator
from .models import Task, Project, TaskComment
import logging

@login_required
def task_list(request):
    """List all tasks for current user"""
    user = request.user
    status_filter = request.GET.get('status', 'all')
    priority_filter = request.GET.get('priority', 'all')
    search_query = request.GET.get('search', '')
    
    tasks = Task.objects.filter(assigned_to=user)
    
    # Apply filters
    if status_filter != 'all':
        tasks = tasks.filter(status=status_filter)
    
    if priority_filter != 'all':
        tasks = tasks.filter(priority=priority_filter)
    
    if search_query:
        tasks = tasks.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(project__name__icontains=search_query)
        )
    
    # Apply sorting
    sort_by = request.GET.get('sort', '-created_at')
    tasks = tasks.order_by(sort_by)
    
    # Pagination
    paginator = Paginator(tasks, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Statistics
    total_tasks = tasks.count()
    completed_tasks = tasks.filter(status='completed').count()
    in_progress_tasks = tasks.filter(status='in_progress').count()
    overdue_tasks = tasks.filter(deadline__lt=timezone.now(), status__in=['new', 'in_progress']).count()
    
    task_stats = {
        'total': total_tasks,
        'completed': completed_tasks,
        'in_progress': in_progress_tasks,
        'overdue': overdue_tasks,
    }
    
    context = {
        'page_obj': page_obj,
        'status_filter': status_filter,
        'priority_filter': priority_filter,
        'search_query': search_query,
        'sort_by': sort_by,
        'status_choices': Task.STATUS_CHOICES,
        'priority_choices': Task.PRIORITY_CHOICES,
        'task_stats': task_stats,
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'overdue_tasks': overdue_tasks,
        'completion_rate': (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
    }
    return render(request, 'tasks/task_list.html', context)

@login_required
def task_detail(request, pk):
    """Task detail view with comments"""
    task = get_object_or_404(Task, pk=pk)
    
    # Check permission - user can view if assigned to them or if they're manager/admin
    if not (task.assigned_to == request.user or 
            task.assigned_by == request.user or
            (hasattr(request.user, 'userprofile') and 
             request.user.userprofile.is_manager or request.user.userprofile.is_admin)):
        messages.error(request, "You don't have permission to view this task.")
        return redirect('tasks:task_list')
    
    comments = task.comments.all()
    
    if request.method == 'POST':
        if 'add_comment' in request.POST:
            comment_text = request.POST.get('comment')
            if comment_text:
                TaskComment.objects.create(
                    task=task,
                    user=request.user,
                    comment=comment_text
                )
                messages.success(request, 'Comment added successfully!')
                return redirect('tasks:task_detail', pk=pk)
        
        elif 'update_status' in request.POST:
            new_status = request.POST.get('status')
            if new_status in dict(Task.STATUS_CHOICES):
                task.status = new_status
                task.save()
                messages.success(request, f'Task status updated to {task.get_status_display()}!')
                return redirect('tasks:task_detail', pk=pk)
    
    context = {
        'task': task,
        'comments': comments,
        'status_choices': Task.STATUS_CHOICES,
    }
    return render(request, 'tasks/task_detail.html', context)

@login_required
def create_task(request):
    """Create new task - only for managers/admins"""
    if not (hasattr(request.user, 'userprofile') and 
            (request.user.userprofile.is_manager or request.user.userprofile.is_admin)):
        messages.error(request, "You don't have permission to create tasks.")
        return redirect('tasks:task_list')
    
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        project_id = request.POST.get('project')
        assigned_to_id = request.POST.get('assigned_to')
        priority = request.POST.get('priority')
        deadline = request.POST.get('deadline')
        estimated_hours = request.POST.get('estimated_hours')
        
        try:
            project = Project.objects.get(pk=project_id)
            assigned_to = User.objects.get(pk=assigned_to_id)
            
            task = Task.objects.create(
                title=title,
                description=description,
                project=project,
                assigned_to=assigned_to,
                assigned_by=request.user,
                priority=priority,
                deadline=deadline,
                estimated_hours=estimated_hours if estimated_hours else None
            )
            
            messages.success(request, f'Task "{title}" created successfully!')
            return redirect('tasks:task_detail', pk=task.pk)
            
        except Exception as e:
            messages.error(request, f'Error creating task: {str(e)}')
    
    # Get projects and users for form
    projects = Project.objects.filter(is_active=True)
    users = User.objects.filter(is_active=True)
    
    context = {
        'projects': projects,
        'users': users,
        'priority_choices': Task.PRIORITY_CHOICES,
    }
    return render(request, 'tasks/create_task.html', context)

@login_required
def project_list(request):
    """List all projects with enhanced filtering and search"""
    user = request.user
    logger = logging.getLogger('apps')
    logger.info(f"[project_list] User {user.username} accessed project list")
    
    # Debug user information
    logger.info(f"[project_list] User details: username={user.username}, is_staff={user.is_staff}, is_superuser={user.is_superuser}")
    
    # Check UserProfile
    has_profile = hasattr(user, 'userprofile')
    logger.info(f"[project_list] Has UserProfile: {has_profile}")
    
    if has_profile:
        logger.info(f"[project_list] UserProfile: role={user.userprofile.role}, is_manager={user.userprofile.is_manager}, is_admin={user.userprofile.is_admin}")
    
    # Check total projects in database
    total_db_projects = Project.objects.count()
    active_db_projects = Project.objects.filter(is_active=True).count()
    logger.info(f"[project_list] Database projects: total={total_db_projects}, active={active_db_projects}")
    
    # Get projects based on user role
    if hasattr(user, 'userprofile') and (user.userprofile.is_manager or user.userprofile.is_admin):
        projects = Project.objects.all()
        logger.info(f"[project_list] Manager/Admin {user.username} sees all projects")
    else:
        # Regular users see all active projects (not just their assigned tasks)
        projects = Project.objects.filter(is_active=True)
        logger.info(f"[project_list] Regular user {user.username} sees all active projects")
    
    # Log queryset before filters
    projects_before_filter = projects.count()
    logger.info(f"[project_list] Projects before filters: {projects_before_filter}")
    
    # Apply filters
    status_filter = request.GET.get('status', 'all')
    if status_filter == 'active':
        projects = projects.filter(is_active=True)
    elif status_filter == 'inactive':
        projects = projects.filter(is_active=False)
    
    search_query = request.GET.get('search', '')
    if search_query:
        projects = projects.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(created_by__first_name__icontains=search_query) |
            Q(created_by__last_name__icontains=search_query)
        )
    
    # Log after filters
    projects_after_filter = projects.count()
    logger.info(f"[project_list] Projects after filters (status={status_filter}, search='{search_query}'): {projects_after_filter}")
    
    # Apply sorting
    sort_by = request.GET.get('sort', '-created_at')
    if sort_by == 'name':
        projects = projects.order_by('name')
    elif sort_by == 'task_count':
        projects = projects.annotate(task_count_annotated=Count('tasks')).order_by('-task_count_annotated')
    elif sort_by == 'progress':
        # Sort by completion percentage
        projects = projects.annotate(
            total_tasks=Count('tasks'),
            completed_tasks=Count('tasks', filter=Q(tasks__status='completed'))
        ).order_by('-completed_tasks', '-total_tasks')
    else:
        projects = projects.order_by('-created_at')
    
    # Pagination
    paginator = Paginator(projects, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Statistics
    total_projects = projects.count()
    active_projects = projects.filter(is_active=True).count()
    total_tasks = sum(project.task_count for project in projects)
    avg_tasks_per_project = total_tasks / total_projects if total_projects > 0 else 0
    
    logger.info(f"[project_list] Final results for user {user.username}: total={total_projects}, active={active_projects}, tasks={total_tasks}")
    
    # Log individual projects
    for i, project in enumerate(projects[:5]):  # Log first 5 projects
        logger.info(f"[project_list] Project {i+1}: {project.name} (active={project.is_active}, created_by={project.created_by.username})")
    
    context = {
        'page_obj': page_obj,
        'projects': page_obj,  # Add this for template compatibility
        'status_filter': status_filter,
        'search_query': search_query,
        'sort_by': sort_by,
        'total_projects': total_projects,
        'active_projects': active_projects,
        'total_tasks': total_tasks,
        'avg_tasks_per_project': round(avg_tasks_per_project, 1),
    }
    return render(request, 'tasks/project_list.html', context)

@login_required
def project_detail(request, pk):
    """Project detail với xử lý Edit Project và lỗi annotation triệt để và logging"""
    project = get_object_or_404(Project, pk=pk)
    user = request.user
    logger = logging.getLogger('apps')
    
    # Handle POST request for Edit Project
    if request.method == 'POST':
        # Check permission for editing
        if not (hasattr(user, 'userprofile') and (user.userprofile.is_manager or user.userprofile.is_admin)):
            logger.warning(f"Unauthorized edit attempt: {user.username} tried to edit project '{project.name}' (ID: {project.pk})")
            messages.error(request, "You don't have permission to edit this project.")
            return redirect('tasks:project_detail', pk=pk)
        
        # Get form data
        name = request.POST.get('name', '').strip()
        description = request.POST.get('description', '').strip()
        is_active = request.POST.get('is_active') == 'on'
        
        # Validation
        errors = []
        
        if not name:
            errors.append('Project name is required.')
        elif len(name) > 200:
            errors.append('Project name must be less than 200 characters.')
        elif Project.objects.filter(name__iexact=name).exclude(pk=project.pk).exists():
            errors.append('A project with this name already exists.')
        
        if len(description) > 1000:
            errors.append('Description must be less than 1000 characters.')
        
        if errors:
            for error in errors:
                messages.error(request, error)
            logger.warning(f"Project edit validation failed for project {project.pk} by {user.username}: {errors}")
        else:
            try:
                # Log changes for audit trail
                changes = []
                if project.name != name:
                    changes.append(f"name: '{project.name}' → '{name}'")
                if project.description != description:
                    changes.append(f"description updated")
                if project.is_active != is_active:
                    status_change = "activated" if is_active else "deactivated"
                    changes.append(f"status: {status_change}")
                
                # Update project
                project.name = name
                project.description = description
                project.is_active = is_active
                project.save()
                
                # Log successful update
                changes_str = ', '.join(changes) if changes else 'no changes'
                logger.info(f"Project '{project.name}' (ID: {project.pk}) updated by {user.username}: {changes_str}")
                
                messages.success(request, f'Project "{project.name}" updated successfully!')
                return redirect('tasks:project_detail', pk=pk)
                
            except Exception as e:
                logger.error(f"Error updating project {project.pk} by {user.username}: {str(e)}", exc_info=True)
                messages.error(request, f'Error updating project: {str(e)}')
    
    # GET request or failed POST - show project details
    if hasattr(user, 'userprofile') and (user.userprofile.is_manager or user.userprofile.is_admin):
        tasks = project.tasks.all()
    else:
        tasks = project.tasks.filter(assigned_to=user)
    
    # Apply filters
    status_filter = request.GET.get('status', 'all')
    priority_filter = request.GET.get('priority', 'all')
    assigned_to_filter = request.GET.get('assigned_to', 'all')
    
    if status_filter != 'all':
        tasks = tasks.filter(status=status_filter)
    if priority_filter != 'all':
        tasks = tasks.filter(priority=priority_filter)
    if assigned_to_filter != 'all':
        tasks = tasks.filter(assigned_to_id=assigned_to_filter)
    
    sort_by = request.GET.get('sort', '-created_at')
    tasks = tasks.order_by(sort_by)
    
    # Pagination
    paginator = Paginator(tasks, 15)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Statistics
    total_tasks = project.tasks.count()
    completed_tasks = project.tasks.filter(status='completed').count()
    in_progress_tasks = project.tasks.filter(status='in_progress').count()
    overdue_tasks = project.tasks.filter(deadline__lt=timezone.now(), status__in=['new', 'in_progress']).count()
    
    # Team members annotation - bọc try/except và log lỗi
    try:
        team_members = User.objects.filter(
            assigned_tasks__project=project
        ).distinct().annotate(
            task_count=Count('assigned_tasks', filter=Q(assigned_tasks__project=project)),
            completed_count=Count('assigned_tasks', filter=Q(assigned_tasks__project=project, assigned_tasks__status='completed'))
        )
        team_members_count = team_members.count() if hasattr(team_members, 'count') else len(team_members)
    except Exception as e:
        logger.error(f"[project_detail] Error annotating team_members for project {project.pk}: {e}", exc_info=True)
        team_members = []
        team_members_count = 0
    
    # Progress by status
    status_stats = {}
    for status, status_name in Task.STATUS_CHOICES:
        count = project.tasks.filter(status=status).count()
        if count > 0:
            status_stats[status] = {
                'name': status_name,
                'count': count,
                'percentage': (count / total_tasks * 100) if total_tasks > 0 else 0
            }
    
    priority_stats = {}
    for priority, priority_name in Task.PRIORITY_CHOICES:
        count = project.tasks.filter(priority=priority).count()
        if count > 0:
            priority_stats[priority] = {
                'name': priority_name,
                'count': count,
                'percentage': (count / total_tasks * 100) if total_tasks > 0 else 0
            }
    
    context = {
        'project': project,
        'page_obj': page_obj,
        'status_filter': status_filter,
        'priority_filter': priority_filter,
        'assigned_to_filter': assigned_to_filter,
        'sort_by': sort_by,
        'status_choices': Task.STATUS_CHOICES,
        'priority_choices': Task.PRIORITY_CHOICES,
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'in_progress_tasks': in_progress_tasks,
        'overdue_tasks': overdue_tasks,
        'progress_percentage': (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
        'team_members': team_members,
        'team_members_count': team_members_count,
        'status_stats': status_stats,
        'priority_stats': priority_stats,
        'can_edit': hasattr(user, 'userprofile') and (user.userprofile.is_manager or user.userprofile.is_admin),
    }
    return render(request, 'tasks/project_detail.html', context)

@login_required 
def create_project(request):
    """Create new project with enhanced validation and features"""
    if not (hasattr(request.user, 'userprofile') and 
            (request.user.userprofile.is_manager or request.user.userprofile.is_admin)):
        messages.error(request, "You don't have permission to create projects.")
        return redirect('tasks:project_list')
    
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')
        is_active = request.POST.get('is_active') == 'on'
        
        # Validation
        if not name or not name.strip():
            messages.error(request, 'Project name is required.')
            return render(request, 'tasks/create_project.html')
        
        if len(name) > 200:
            messages.error(request, 'Project name must be less than 200 characters.')
            return render(request, 'tasks/create_project.html')
        
        # Check if project name already exists
        if Project.objects.filter(name__iexact=name.strip()).exists():
            messages.error(request, 'A project with this name already exists.')
            return render(request, 'tasks/create_project.html')
        
        try:
            project = Project.objects.create(
                name=name.strip(),
                description=description.strip() if description else '',
                created_by=request.user,
                is_active=is_active
            )
            
            messages.success(request, f'Project "{project.name}" created successfully!')
            return redirect('tasks:project_detail', pk=project.pk)
            
        except Exception as e:
            messages.error(request, f'Error creating project: {str(e)}')
    
    context = {
        'max_name_length': 200,
        'max_description_length': 1000,
    }
    return render(request, 'tasks/create_project.html', context)

@login_required
def assign_tasks(request):
    """Task assignment interface for admin/manager"""
    if not (hasattr(request.user, 'userprofile') and 
            (request.user.userprofile.is_manager or request.user.userprofile.is_admin)):
        messages.error(request, "You don't have permission to assign tasks.")
        return redirect('tasks:task_list')
    
    logger = logging.getLogger('apps')
    logger.info(f"Task assignment interface accessed by {request.user.username}")
    
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'assign_single':
            # Assign single task
            task_id = request.POST.get('task_id')
            assigned_to_id = request.POST.get('assigned_to')
            
            try:
                task = Task.objects.get(pk=task_id)
                assigned_to = User.objects.get(pk=assigned_to_id)
                
                old_assignee = task.assigned_to
                task.assigned_to = assigned_to
                task.save()
                
                logger.info(f"Task '{task.title}' reassigned from {old_assignee.username} to {assigned_to.username} by {request.user.username}")
                messages.success(request, f'Task "{task.title}" assigned to {assigned_to.get_full_name()}')
                
            except (Task.DoesNotExist, User.DoesNotExist) as e:
                logger.error(f"Error assigning task: {str(e)}")
                messages.error(request, 'Error assigning task. Please try again.')
        
        elif action == 'bulk_assign':
            # Bulk assign multiple tasks
            task_ids = request.POST.getlist('task_ids')
            assigned_to_id = request.POST.get('bulk_assigned_to')
            
            if task_ids and assigned_to_id:
                try:
                    assigned_to = User.objects.get(pk=assigned_to_id)
                    tasks = Task.objects.filter(pk__in=task_ids)
                    
                    assigned_count = 0
                    for task in tasks:
                        old_assignee = task.assigned_to
                        task.assigned_to = assigned_to
                        task.save()
                        assigned_count += 1
                        logger.info(f"Task '{task.title}' reassigned from {old_assignee.username} to {assigned_to.username} by {request.user.username}")
                    
                    messages.success(request, f'{assigned_count} tasks assigned to {assigned_to.get_full_name()}')
                    
                except User.DoesNotExist:
                    messages.error(request, 'Selected user not found.')
                except Exception as e:
                    logger.error(f"Error in bulk assignment: {str(e)}")
                    messages.error(request, 'Error during bulk assignment.')
        
        elif action == 'create_and_assign':
            # Create new task and assign
            title = request.POST.get('title')
            description = request.POST.get('description')
            project_id = request.POST.get('project')
            assigned_to_id = request.POST.get('assigned_to')
            priority = request.POST.get('priority')
            deadline = request.POST.get('deadline')
            estimated_hours = request.POST.get('estimated_hours')
            
            try:
                project = Project.objects.get(pk=project_id)
                assigned_to = User.objects.get(pk=assigned_to_id)
                
                task = Task.objects.create(
                    title=title,
                    description=description,
                    project=project,
                    assigned_to=assigned_to,
                    assigned_by=request.user,
                    priority=priority,
                    deadline=deadline,
                    estimated_hours=estimated_hours if estimated_hours else None
                )
                
                logger.info(f"New task '{task.title}' created and assigned to {assigned_to.username} by {request.user.username}")
                messages.success(request, f'Task "{title}" created and assigned to {assigned_to.get_full_name()}')
                
            except Exception as e:
                logger.error(f"Error creating and assigning task: {str(e)}")
                messages.error(request, f'Error creating task: {str(e)}')
    
    # Get data for the interface
    projects = Project.objects.filter(is_active=True).order_by('name')
    users = User.objects.filter(is_active=True).order_by('first_name', 'last_name')
    
    # Get unassigned tasks (if any) and tasks that can be reassigned
    unassigned_tasks = Task.objects.filter(status='new').order_by('-created_at')[:10]
    
    # Get tasks by status for easy assignment
    tasks_by_status = {}
    for status, _ in Task.STATUS_CHOICES:
        tasks_by_status[status] = Task.objects.filter(status=status).order_by('-created_at')[:5]
    
    # Get user workload statistics
    user_workload = []
    for user in users:
        if hasattr(user, 'userprofile') and user.userprofile.role == 'user':
            total_tasks = user.assigned_tasks.count()
            active_tasks = user.assigned_tasks.filter(status__in=['new', 'in_progress']).count()
            completed_tasks = user.assigned_tasks.filter(status='completed').count()
            
            user_workload.append({
                'user': user,
                'total_tasks': total_tasks,
                'active_tasks': active_tasks,
                'completed_tasks': completed_tasks,
                'workload_percentage': min(100, (active_tasks / max(1, total_tasks)) * 100)
            })
    
    # Sort by workload (highest first)
    user_workload.sort(key=lambda x: x['active_tasks'], reverse=True)
    
    context = {
        'projects': projects,
        'users': users,
        'unassigned_tasks': unassigned_tasks,
        'tasks_by_status': tasks_by_status,
        'user_workload': user_workload,
        'priority_choices': Task.PRIORITY_CHOICES,
        'status_choices': Task.STATUS_CHOICES,
    }
    
    return render(request, 'tasks/assign_tasks.html', context)

@login_required
def delete_project(request, pk):
    """Delete project with comprehensive safety checks - only for admin/manager"""
    if not (hasattr(request.user, 'userprofile') and 
            (request.user.userprofile.is_manager or request.user.userprofile.is_admin)):
        messages.error(request, "You don't have permission to delete projects.")
        return redirect('tasks:project_list')
    
    project = get_object_or_404(Project, pk=pk)
    logger = logging.getLogger('apps')
    
    # Security check: Only project creator, admin, or manager can delete
    if not (project.created_by == request.user or 
            request.user.userprofile.is_admin or 
            (request.user.userprofile.is_manager and request.user.userprofile.department == getattr(project.created_by.userprofile, 'department', None))):
        logger.warning(f"Unauthorized delete attempt: {request.user.username} tried to delete project '{project.name}' (ID: {project.pk})")
        messages.error(request, "You don't have permission to delete this project.")
        return redirect('tasks:project_detail', pk=pk)
    
    if request.method == 'POST':
        # Additional confirmation checks
        confirm_name = request.POST.get('confirm_name', '').strip()
        confirm_action = request.POST.get('confirm_action')
        understand_consequences = request.POST.get('understand_consequences')
        
        # Validation checks
        if confirm_name != project.name:
            messages.error(request, 'Project name confirmation does not match.')
            return render(request, 'tasks/delete_project.html', {'project': project})
        
        if confirm_action != 'DELETE':
            messages.error(request, 'Please type "DELETE" to confirm the action.')
            return render(request, 'tasks/delete_project.html', {'project': project})
        
        if not understand_consequences:
            messages.error(request, 'You must acknowledge understanding the consequences.')
            return render(request, 'tasks/delete_project.html', {'project': project})
        
        try:
            # Log before deletion for audit trail
            task_count = project.tasks.count()
            logger.warning(f"PROJECT DELETION: User {request.user.username} is deleting project '{project.name}' (ID: {project.pk}) with {task_count} associated tasks")
            
            # Store project info for logging
            project_name = project.name
            project_id = project.pk
            
            # Delete project (this will cascade delete all related tasks, comments, etc.)
            project.delete()
            
            logger.warning(f"PROJECT DELETED: Project '{project_name}' (ID: {project_id}) successfully deleted by {request.user.username}")
            messages.success(request, f'Project "{project_name}" has been permanently deleted.')
            
            return redirect('tasks:project_list')
            
        except Exception as e:
            logger.error(f"Error deleting project '{project.name}' (ID: {project.pk}): {str(e)}", exc_info=True)
            messages.error(request, f'Error deleting project: {str(e)}')
            return render(request, 'tasks/delete_project.html', {'project': project})
    
    # GET request - show confirmation page
    # Calculate impact statistics
    total_tasks = project.tasks.count()
    task_status_counts = {}
    for status, status_name in Task.STATUS_CHOICES:
        count = project.tasks.filter(status=status).count()
        if count > 0:
            task_status_counts[status_name] = count
    
    assigned_users = project.tasks.values_list('assigned_to__username', flat=True).distinct()
    comments_count = TaskComment.objects.filter(task__project=project).count()
    
    context = {
        'project': project,
        'total_tasks': total_tasks,
        'task_status_counts': task_status_counts,
        'assigned_users_count': len(assigned_users),
        'assigned_users': list(assigned_users)[:5],  # Show first 5 users
        'comments_count': comments_count,
        'can_delete': True,  # We already checked permissions above
    }
    
    return render(request, 'tasks/delete_project.html', context) 