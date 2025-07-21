from django.shortcuts import render
from rest_framework import viewsets,permissions
from .models import Task , Project,User
from .serializers import TaskSerializer,ProjectSerializer,RegisterSerializer, UserSerializer
from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
@permission_classes([IsAdminUser])
class UserViewSet(viewsets.ModelViewSet):
    queryset= User.objects.all()
    serializer_class = UserSerializer
    
class TaskViewSet(viewsets.ModelViewSet):
    queryset= Task.objects.select_related('assignee').all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project', 'assignee']
    permission_classes = [permissions.IsAuthenticated]
# Create your views here.
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Project.objects.filter(owner = self.request.user)

    def perform_create(self,serializer):
        serializer.save(owner = self.request.user)

class RegisterView (APIView):
    def post(self, request):
        serializer = RegisterSerializer(data= request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'user created'}, status= status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
