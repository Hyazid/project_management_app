from django.shortcuts import render
from rest_framework import viewsets,permissions
from django.db.models import Q
from .models import Task , Project,User,Message
from .serializers import TaskSerializer,ProjectSerializer,RegisterSerializer, UserSerializer, MessageSerializer
from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response


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
class MessageViewSet(viewsets.ModelViewSet):
    sender = UserSerializer(read_only=True)
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(sender=user) | Message.objects.filter(receiver=user)
    def perform_create(self,serializer):
        serializer.save(sender = self.request.user)
class RegisterView (APIView):
    def post(self, request):
        serializer = RegisterSerializer(data= request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'user created'}, status= status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def Task_stats(request):
    users= User.objects.all()
    task_count =[]
    for user in users:
        assigned_count = Task.objects.filter(assignee = user).count()
        completed_count =  Task.objects.filter(assignee = user, status ='done').count()
        task_count.append({
            'id':user.id,
            'username':user.username,
            'assigned':assigned_count,
            'completed':completed_count,
        })
    total_task = Task.objects.count()
    completed_tasks=  Task.objects.filter(status='done').count()
    return Response({
        'per_user':task_count,
        'total':{
            'all':total_task,
            'completed':completed_tasks
        }
    })

#return all the task for a user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_task(request):
    tasks= Task.objects.filter(assignee=request.user)
    serializer = TaskSerializer(tasks,many=True)
    return Response(serializer.data)
#return all the projects by a user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_project(request):
    user = request.user
    projects = Project.objects.filter(owner=user).distinct()
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)






