from django.contrib.auth.models import AbstractUser
from django.db import models



class Post(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, blank=True, null=True)
    text = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField('User', related_name='liked', blank=True)

    def serialize(self):
        return {
            "id": self.id,
            "user": {
                "id": self.user.id,  # Access the id of the associated User
                "username": self.user.username
            },
            "text": self.text,
            "timestamp": self.timestamp.strftime("%B %d %Y, %I:%M %p"),
            "likes": {
                "count": self.likes.count(),
                "users": [{"id": user.id, "username": user.username} for user in self.likes.all()]
            }
        }

class Comment(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, blank=True, null=True)
    text = models.CharField(max_length=420, blank=True)
    post = models.ForeignKey('Post', on_delete=models.CASCADE, blank=True, null=True)
    
    def __str__(self):
        return self.text

class User(AbstractUser):
    followers = models.ManyToManyField('self', related_name='following', symmetrical=False, blank=True)
    def __str__(self):
        return self.username


# access all posts of a user with <user>.post_set.all()