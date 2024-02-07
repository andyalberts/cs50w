from django.contrib.auth.models import AbstractUser
from django.db import models

class Listing(models.Model):
    title = models.CharField(max_length=125)
    description = models.CharField(max_length=250, blank=True)
    start_bid = models.DecimalField(max_digits=7, decimal_places=2)
    image = models.ImageField(upload_to='media', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    def __str__(self):
        return f"{self.title}, {self.start_bid}"

class User(AbstractUser):
    listings = models.ManyToManyField(Listing, blank=True, related_name="owner")
    watch_list = models.ManyToManyField(Listing, blank=True, related_name="watchers")

class Bid(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='bids')
    bid_amount = models.DecimalField(max_digits=7, decimal_places=2)

class Comments(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='comments')
    text = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.text}, {self.user}"
    