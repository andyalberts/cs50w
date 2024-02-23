from django import forms
from django.contrib import messages
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

c = {"categories":categories}

class CommentForm(forms.Form):
    comment = forms.CharField(widget=forms.Textarea,label="comment")


def index(request):
    return render(request, "auctions/index.html", {
        "listings": Listing.objects.all(),
        "categories":categories
    })

# ----------------- User Handling ------------------------

# TODO Make sure login handles upper and lowercase letters

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

# TODO: Show current bid
# TODO: Allow user to "close" entry. Listing goes to highest bidder
def listing(request, id):
    listing = Listing.objects.get(pk=id)
    comments = Comments.objects.filter(listing=listing)
    owner = get_object_or_404(User, id=listing.owner.first().id)
    test = messages.get_messages(request)
    latest_bid = listing.bids.last()
    latest_bidder = latest_bid.user if latest_bid else None
    logged_in = request.user
    
    if request.method == 'POST':
        user_input = CommentForm(request.POST)
        #---comments---
        if user_input.is_valid():
            new_comment = Comments(
                listing=listing,
                user=request.user, 
                text=user_input.cleaned_data["comment"]
            )
            new_comment.save()
            # refreshes comment section after adding one
            comments = Comments.objects.filter(listing=listing)
        print(logged_in.username)
        return render(request, 'auctions/listing.html',
        {"id": listing.id, 
         "title": listing.title, 
         "image": listing.image.url, 
         "description": listing.description, 
         "start_bid": listing.start_bid, 
         "comments": comments,
         "owner": owner,
         "category": listing.category,
         "messages": test,
         "bidder":latest_bidder,
         "bid":latest_bid,
         "logged_in":logged_in,
         "categories":categories})
    else:
        print(logged_in.username)
        return render(request, 'auctions/listing.html',
        {"id": listing.id, 
         "title": listing.title, 
         "image": listing.image.url, 
         "description": listing.description, 
         "start_bid": listing.start_bid, 
         "comments": comments,
         "owner": owner,
         "category": listing.category,
         "messages": test,
         "bidder":latest_bidder,
         "bid":latest_bid,
         "logged_in":logged_in,
         "categories":categories})

#TODO: Remove inactive listings
@login_required
def watchlist(request):
    user = request.user
    watchlist = user.watchlist.all()
    print(user)
    print(listing)
    print(watchlist)
    return render(request, 'auctions/watchlist.html',{
        "user": user,
        "watchlist": watchlist,
        "categories":categories
    })


# TODO: Find way to add categories to every view context w/o explicitly adding variable to all context
def category(request):
    # listing = Listing.objects.all()
    if request.method == 'POST':
     category = request.POST["category"]
     chosen = Listing.objects.filter(category=category)
     return render(request, 'auctions/category.html', {"chosen":chosen, "categories":categories})
    
    return render(request, 'auctions/category.html',{"categories":categories})
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
    return redirect('watchlist',{"categories":categories})

@login_required
def place_bid(request,id):
    if request.method == "POST":
        listing = get_object_or_404(Listing, pk=id)
        listing_bids = listing.bids.all()
        
        try:
            user_bid = Decimal(request.POST["bid"])
        except Decimal.InvalidOperation:
            messages.error(request, "Bid amount must be greater than the current bid.")
            return redirect('listing')
        if listing_bids:
            if user_bid > (listing.start_bid and listing.bids.last().current_bid):
                new_bid = Bid(listing=listing, current_bid=user_bid, user=request.user)
                new_bid.save()
            else: 
                messages.error(request, "Bid amount must be greater than the current bid.")
                return redirect('listing', id=id )
        else: 
            if user_bid > listing.start_bid:
                new_bid=Bid(listing=listing, current_bid=user_bid, user=request.user)
                new_bid.save()
            else:
                messages.error(request, "Bid amount must be greater than starting bid")
    return redirect('index')
 
        


