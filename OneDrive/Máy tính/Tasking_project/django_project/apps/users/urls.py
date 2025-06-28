from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    # User profile
    path('profile/', views.profile, name='profile'),
    path('change-password/', views.change_password, name='change_password'),
    
    # User management (Admin/Manager only)
    path('', views.user_list, name='user_list'),
    path('list/', views.user_list, name='user_list'),  # Alternative URL
    path('add/', views.add_user, name='add_user'),
    path('<int:pk>/', views.user_detail, name='user_detail'),
    path('<int:pk>/edit/', views.edit_user, name='edit_user'),
    path('<int:pk>/delete/', views.delete_user, name='delete_user'),
    path('<int:pk>/hard-delete/', views.hard_delete_user, name='hard_delete_user'),
    path('<int:pk>/reactivate/', views.reactivate_user, name='reactivate_user'),
    path('<int:pk>/reset-password/', views.reset_user_password, name='reset_password'),
] 