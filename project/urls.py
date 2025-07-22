from rest_framework.routers import DefaultRouter
from .views import TaskViewSet,ProjectViewSet,RegisterView,UserViewSet,Task_stats,my_project,my_task
from django.urls import path, include
router = DefaultRouter()
router.register(r'project/tasks', TaskViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'users', UserViewSet)


urlpatterns = [
    path('',include(router.urls)),
    path('task-stats/', Task_stats, name='task-stats'),
    path('my-tasks/', my_task, name='myTask'),
    path('my-projects/', my_project, name='Myproject'),
    path('register/',RegisterView.as_view(), name='register')
]