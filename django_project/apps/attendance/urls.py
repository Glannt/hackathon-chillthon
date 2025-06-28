from django.urls import path
from . import views

app_name = 'attendance'

urlpatterns = [
    path('', views.attendance_dashboard, name='dashboard'),
    path('check-in/', views.check_in, name='check_in'),
    path('check-out/', views.check_out, name='check_out'),
    path('status/', views.get_attendance_status, name='attendance_status'),
    path('history/', views.attendance_history, name='history'),
    path('team/', views.team_attendance, name='team_attendance'),
    path('list/', views.attendance_list, name='attendance_list'),
]