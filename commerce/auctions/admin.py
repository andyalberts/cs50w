from django.contrib import admin
from .models import User, Listing, Bid, Comments

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    user_display= ["id","listings"]

class ListingAdmin(admin.ModelAdmin):
    list_display= ["title", "description", "start_bid", "image", "category","is_active"]

class BidAdmin(admin.ModelAdmin):
    list_display=["listing", "current_bid", "user", "created"]

class CommentsAdmin(admin.ModelAdmin):
    list_display=["listing","text","user"]
   

admin.site.register(User, UserAdmin)
admin.site.register(Listing, ListingAdmin)
admin.site.register(Bid, BidAdmin)
admin.site.register(Comments, CommentsAdmin)

