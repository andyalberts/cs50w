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
    path("posts", views.posts, name="posts"), # gets all posts
    path("comments/<int:id>",views.load_comments, name="load_comments"),
    path("submit_post", views.submit_post, name="submit_post"),
    path("like_post/<int:id>", views.like_post, name="like_post"),

    path("save_edit/<int:id>", views.save_edit, name="save_edit"),
    path("post_comment/<int:id>", views.post_comment, name="post_comment"),
    
    path("profile/<int:id>", views.user_profile, name="profile"),
    path("profile/follow/<int:id>", views.follow_user, name="follow_user"),

    path("following", views.following_page, name="following"),
    path("following_posts", views.following_posts, name="following_posts"),
]
