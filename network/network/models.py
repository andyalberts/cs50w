from django.contrib.auth.models import AbstractUser
from django.db import models



class Post(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, blank=True, null=True)
    text = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user,
            "text": self.text,
            "timestamp": self.timestamp.strftime("%B %d %Y, %I:%M %p"),
            "likes": self.likes
        }

class User(AbstractUser):
    pass

# access all posts of a user with <user>.post_set.all()