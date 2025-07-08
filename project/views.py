from django.shortcuts import render
from rest_framework import viewsets
from .models import Task , Project
from .serializers import TaskSerializer,ProjectSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset= Task.objects.all()
    serializer_class = TaskSerializer
# Create your views here.
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer