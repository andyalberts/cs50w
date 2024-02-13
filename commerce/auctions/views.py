from django import forms
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required 
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from .models import User, Listing, Comments, Bid
from decimal import *

categories = ["Food/Drink", 
              "Art", 
              "Electronics", 
              "Toys",
              "Hobby"]

class CommentForm(forms.Form):
    comment = forms.CharField(widget=forms.Textarea,label="comment")

def index(request):
    return render(request, "auctions/index.html", {
        "listings": Listing.objects.all()
    })

# ----------------- User Handling ------------------------

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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]

        # Ensure password matches confirmation
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
    else:
        return render(request, "auctions/register.html")

# -------------Main Views--------------------------------


def listing(request, id):
    listing = Listing.objects.get(pk=id)
    comments = Comments.objects.filter(listing=listing)
    owner = get_object_or_404(User, id=listing.owner.first().id)

    if request.method == 'POST':
        user_input = CommentForm(request.POST)
        # comments
        if user_input.is_valid():
            new_comment = Comments(
                listing=listing,
                user=request.user, 
                text=user_input.cleaned_data["comment"]
            )
            new_comment.save()
            # refreshes comment section after adding one
            comments = Comments.objects.filter(listing=listing)
      
        return render(request, 'auctions/listing.html',
        {"id": listing.id, 
         "title": listing.title, 
         "image": listing.image.url, 
         "description": listing.description, 
         "start_bid": listing.start_bid, 
         "comments": comments,
         "owner": owner,
         "category": listing.category})
    else:
        
        return render(request, 'auctions/listing.html',
        {"id": listing.id, 
         "title": listing.title, 
         "image": listing.image.url, 
         "description": listing.description, 
         "start_bid": listing.start_bid, 
         "comments": comments,
         "owner": owner,
         "category": listing.category})
    
def category(request,id):
    listing = Listing.objects.get(pk=id)
    if request.method == "POST":
        listing
        
    return redirect('index')
#---------------- Logged in ---------------------

@login_required
def create_listing(request):
    if request.method == "POST":
        title = request.POST["title"]
        description = request.POST["description"]
        start_bid = request.POST["start_bid"]
        image = request.FILES.get("image")
        owner = request.user
        category = request.POST["category"]

        # create
        new_entry = Listing(title=title, description=description, start_bid=start_bid, image=image, category=category)
        new_entry.save()
        owner.listings.add(new_entry)

        return redirect('index')
   
    return render(request, 'auctions/create.html',{"categories":categories})

@login_required
def add_rmv_watchlist(request, id):
    listing = Listing.objects.get(pk=id)
    user = request.user
    watchlist = user.watchlist.all()

    if request.method == "POST":
        if listing not in watchlist:
            user.watchlist.add(listing)
        else:
            user.watchlist.remove(listing)
        
        return redirect('watchlist')
    return redirect('watchlist')

@login_required
def watchlist(request):
    user = request.user
    watchlist = user.watchlist.all()
    print(user)
    print(listing)
    print(watchlist)
    return render(request, 'auctions/watchlist.html',{
        "user": user,
        "watchlist": watchlist
    })

def place_bid(request,id):
    if request.method == "POST":
        listing = get_object_or_404(Listing, pk=id)
        try:
            user_bid = Decimal(request.POST["bid"])
        except Decimal.InvalidOperation:
            return redirect('listing')
        
        if user_bid > (listing.start_bid and listing.bids.last().current_bid):
           new_bid = Bid(listing=listing, current_bid=user_bid)
           new_bid.save()
        else: 
            return redirect('index')
    return redirect('index')
 
        


