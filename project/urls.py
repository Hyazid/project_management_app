from rest_framework.routers import DefaultRouter
from .views import TaskViewSet,ProjectViewSet,RegisterView,UserViewSet,MessageViewSet,Task_stats,my_project,my_task,me
from django.urls import path, include
router = DefaultRouter()
router.register(r'project/tasks', TaskViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'users', UserViewSet)
router.register(r'messages', MessageViewSet)


urlpatterns = [
    
    path('auth/me/', me, name='me'),
    path('task-stats/', Task_stats, name='task-stats'),
    path('my-tasks/', my_task, name='myTask'),
    path('my-projects/', my_project, name='Myproject'),
    path('register/',RegisterView.as_view(), name='register'),
    path('',include(router.urls)),
]