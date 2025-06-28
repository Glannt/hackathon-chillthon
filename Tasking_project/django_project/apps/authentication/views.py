from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.contrib.auth.forms import UserCreationForm
from .models import UserProfile
import logging

# Get logger for this module
logger = logging.getLogger('authentication')
activity_logger = logging.getLogger('apps.authentication')

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        
        logger.info(f"Login attempt for username: {username} from IP: {request.META.get('REMOTE_ADDR', 'Unknown')}")
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Get or create user profile
            profile, created = UserProfile.objects.get_or_create(user=user)
            if created:
                activity_logger.info(f"New UserProfile created for {user.username}")
            
            messages.success(request, f'Welcome back, {user.get_full_name() or user.username}!')
            activity_logger.info(f"Successful login for {user.username} ({user.get_full_name()}) with role: {profile.role}")
            return redirect('dashboard:home')
        else:
            messages.error(request, 'Invalid username or password.')
            logger.warning(f"Failed login attempt for username: {username} from IP: {request.META.get('REMOTE_ADDR', 'Unknown')}")
    
    return render(request, 'authentication/login.html')

def logout_view(request):
    username = request.user.username if request.user.is_authenticated else 'Anonymous'
    logger.info(f"Logout request from user: {username}")
    
    logout(request)
    messages.info(request, 'You have been logged out successfully.')
    activity_logger.info(f"User {username} logged out successfully")
    return redirect('authentication:login')

def register_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        password1 = request.POST['password1']
        password2 = request.POST['password2']
        
        logger.info(f"Registration attempt for username: {username}, email: {email}")
        
        # Basic validation
        if password1 != password2:
            messages.error(request, 'Passwords do not match.')
            logger.warning(f"Registration failed for {username}: Password mismatch")
            return render(request, 'authentication/register.html')
        
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            logger.warning(f"Registration failed for {username}: Username already exists")
            return render(request, 'authentication/register.html')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists.')
            logger.warning(f"Registration failed for {username}: Email {email} already exists")
            return render(request, 'authentication/register.html')
        
        try:
            # Create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password1,
                first_name=first_name,
                last_name=last_name
            )
            
            # Create user profile
            UserProfile.objects.create(user=user, role='user')
            
            messages.success(request, 'Account created successfully! Please login.')
            activity_logger.info(f"New user registered successfully: {username} ({first_name} {last_name}) - {email}")
            return redirect('authentication:login')
            
        except Exception as e:
            messages.error(request, f'Error creating account: {str(e)}')
            logger.error(f"Registration error for {username}: {str(e)}")
    
    return render(request, 'authentication/register.html')