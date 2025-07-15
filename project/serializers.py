from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Task, Project

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    class Meta:
        model = Project
        fields = '__all__'
        
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model= User
        fields= ['username','email','password']
    def create(self,validate_data):
        user = User.objects.create_user(
            username=validate_data['username'],
            email= validate_data['email'],
            password= validate_data['password']
        )
        return user
