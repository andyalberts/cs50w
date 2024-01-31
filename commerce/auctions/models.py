from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Listing(models.Model):
    title = models.CharField(max_length=125)
    start_bid = models.DecimalField(max_digits=7, decimal_places=2)
    listing_image = models.ImageField(upload_to='static/auctions/listing_images', null=True, blank=True)
    active 

class Bids(models.Model):
    start_bid = models.DecimalField(max_digits=7, decimal_places=2)
    current_bid = models.DecimalField(max_digits=7, decimal_places=2)

class Comments(models.Model):
    pass