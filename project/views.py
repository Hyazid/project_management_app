from django.shortcuts import render
from rest_framework import viewsets
from .models import Task , Project,User
from .serializers import TaskSerializer,ProjectSerializer,RegisterSerializer
from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response

class TaskViewSet(viewsets.ModelViewSet):
    queryset= Task.objects.all()
    serializer_class = TaskSerializer
# Create your views here.
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class RegisterView (APIView):
    def post(self, request):
        serializer = RegisterSerializer(data= request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'user created'}, status= status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
