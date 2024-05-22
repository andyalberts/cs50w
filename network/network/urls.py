from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    #API routes
    path("submit_post", views.submit_post, name="submit_post"),
    path("save_edit/<int:id>", views.save_edit, name="save_edit"),
    path("posts", views.posts, name="posts"),
    path("like_post", views.like_post, name="like_post"),
    
    path("profile/<int:id>", views.user_profile, name="profile"),
    path("profile/follow/<int:id>", views.follow_user, name="follow_user"),

    path("following", views.following_page, name="following"),
    path("following_posts", views.following_posts, name="following_posts"),
]
