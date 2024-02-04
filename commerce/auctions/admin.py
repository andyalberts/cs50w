from django.contrib import admin
from .models import User, Listing

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    user_display=("id","listings")

admin.site.register(User, UserAdmin)