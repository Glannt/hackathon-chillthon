from django.urls import path
from . import views

app_name = 'tasks'

urlpatterns = [
    # Task URLs
    path('', views.task_list, name='task_list'),
    path('task/<int:pk>/', views.task_detail, name='task_detail'),
    path('task/create/', views.create_task, name='create_task'),
    path('assign/', views.assign_tasks, name='assign_tasks'),
    
    # Project URLs
    path('projects/', views.project_list, name='project_list'),
    path('project/<int:pk>/', views.project_detail, name='project_detail'),
    path('project/create/', views.create_project, name='create_project'),
    path('project/<int:pk>/delete/', views.delete_project, name='delete_project'),
]