import json
from json import JSONDecodeError
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse

from .models import User, Post


def index(request):
    if request.user.is_authenticated:
        return render(request, "network/index.html")
    else:
        return HttpResponseRedirect(reverse("login"))


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def submit_post(request):
    if request.method == "POST":

        try:
            # Get data from body of fetch request
            data = json.loads(request.body)
            post = data.get("text", "")
        except JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)

        # Create and save post
        user_post = Post(
            user=request.user,
            text=post
        )  
        user_post.save()
        
        return JsonResponse({"message": "Content Posted Successfully."}, status=201)

    return JsonResponse({"error": "POST request required."}, status=400)

def posts(request):
    if request.method == "GET":
        page_number = request.GET.get('page', 1)
        # retrieve posts, order them by timestamp desc
        posts = Post.objects.all()
        by_time = posts.order_by("-timestamp").all()
        # show 7 posts per page
        paginator = Paginator(by_time,7)
        page_posts = paginator.get_page(page_number)
        return JsonResponse({"posts": [post.serialize() for post in page_posts]})

    pass

# TODO: Render user posts through JS 
def user_profile(request, id):
    if request.method == "GET":
        posts = Post.objects.filter(user=id)
        user = User.objects.get(pk=id)
        print(user)
        print(posts)
        followers = user.followers.all()
        following = user.following.all()

        # load users posts -> append/prepend 
        return render(request, "network/profile.html", {
            "posts":posts.all(),
            "username": user.username,
            "followers": followers.__len__,
            "following": following.__len__,
        })

