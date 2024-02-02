from django.contrib.auth.models import AbstractUser
from django.db import models

class Listing(models.Model):
    title = models.CharField(max_length=125)
    description = models.CharField(max_length=250, blank=True)
    start_bid = models.DecimalField(max_digits=7, decimal_places=2)
    image = models.ImageField(upload_to='auctions/listing_images', null=True, blank=True)

class User(AbstractUser):
    watch_list = models.ManyToManyField(Listing, blank=True, related_name="watchers")

class Bid(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='bids')
    bid_amount = models.DecimalField(max_digits=7, decimal_places=2)

class Comments(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='comments')
    text = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    