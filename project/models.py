from django.db import models
from django.contrib.auth.models import User
# Create your models here.
#note that  user model is pre build 
class Project (models.Model):
    name= models.CharField(max_length=100)
    description= models.TextField(blank=True)
    owner= models.ForeignKey(User, on_delete=models.CASCADE)
    start_date = models.DateField(null=True)
    end_date  = models.DateField(null=True)
    owner =  models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.name
    
class Task (models.Model):
    STATUS_CHOICES=[
        ('todo','To Do'),
        ('in-progress','In Progress'),
        ('done','Done'),
    ]
    PRIORITY_CHOICES=[
        ('low','Low'),
        ('medium','Medium'),
        ('high','High'),
    ]
    project= models.ForeignKey(Project, related_name='tasks',on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES,default='todo')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='low')
    def __str__(self):
        return self.title

