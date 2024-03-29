from django.contrib.auth.models import AbstractUser
from django.db import models


class Listing(models.Model):
    title = models.CharField(max_length=125)
    description = models.CharField(max_length=250, blank=True)
    start_bid = models.DecimalField(max_digits=7, decimal_places=2)
    image = models.ImageField(upload_to='media', default='defaultimg.png', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    category = models.CharField(max_length=45, null=True)
    winner = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='won_listings')

    def __str__(self):
        return f"{self.title}"
    
    def set_winner(self):
        # Get highest bid
        highest_bid = self.bids.order_by('-current_bid').first()

        if highest_bid:
            # Get highest bidder and save to winner
            self.winner = highest_bid.user
            self.save()

class User(AbstractUser):
    listings = models.ManyToManyField(Listing, blank=True, related_name="owner")
    watchlist = models.ManyToManyField(Listing, blank=True, related_name="watchers")

    def __str__(self):
        return f"{self.username}"
    
class Bid(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='bids')
    current_bid = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE, related_name='bidder')
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.current_bid}"

class Comments(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='comments')
    text = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.text}, {self.user}"
    