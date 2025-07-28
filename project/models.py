from django.db import models
from django.contrib.auth.models import User
# Create your models here.
#note that  user model is pre build 
class Project (models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
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
    assignee = models.ForeignKey(User,null=True, blank=True, on_delete=models.SET_NULL, related_name='assigned_tasks')
    def __str__(self):
        return self.title

class Message(models.Model):
    sender   = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    body     = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read       = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.sender} → {self.receiver}: {self.body[:50]}"

