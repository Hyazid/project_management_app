from rest_framework.routers import DefaultRouter
from .views import TaskViewSet,ProjectViewSet
from django.urls import path, include
router = DefaultRouter()
router.register(r'project/tasks', TaskViewSet)
router.register(r'projects', ProjectViewSet)

urlpatterns = [
    path('',include(router.urls))
]