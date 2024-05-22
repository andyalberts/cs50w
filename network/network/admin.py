from django.contrib import admin
from .models import User, Post

# Register your models here.
class PostInline(admin.TabularInline):  # or admin.StackedInline if you prefer
    model = Post
    extra = 0 

class UserAdmin(admin.ModelAdmin):
    user_display=["id"]
    inlines = [PostInline]

class PostAdmin(admin.ModelAdmin):
    list_display = ["user","text","timestamp"]

admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)