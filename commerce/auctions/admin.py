from django.contrib import admin
from .models import User, Listing

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    user_display= ["id","listings"]

class ListingAdmin(admin.ModelAdmin):
    list_display= ["title", "description", "start_bid", "image", "category","is_active"]

admin.site.register(User, UserAdmin)
admin.site.register(Listing, ListingAdmin)