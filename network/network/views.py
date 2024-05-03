import json
from json import JSONDecodeError
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.views.decorators.http import require_http_methods


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

def user_profile(request, id):
    if request.method == "GET":
        # retrieve user posts, following, followers
        user = User.objects.get(pk=id)
        posts = Post.objects.filter(user=id)
        current_user = request.user
        followers = user.followers.all()
        following = user.following.all()

        # load users posts -> append/prepend 
        return render(request, "network/profile.html", {
            "posts":posts.all(),
            "username": user.username,
            "logged_in": current_user,
            "followers": followers.__len__,
            "following": following.__len__,
        })

@login_required
@require_http_methods
def follow_user(request, user_id):
    # gets current user, and target user to follow
    target_user = get_object_or_404(User, pk=user_id)
    current_user_id = request.user.id
    current_user = get_object_or_404(User, pk=current_user_id)
    current_user.following.add(target_user)
    target_user.followers.add(current_user)

    return JsonResponse({'message': 'User followed successfully'})
    
