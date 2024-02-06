from django import forms
from django.http import HttpResponseRedirect
from django.shortcuts import render
from .models import Flight, Passenger
from django.urls import reverse
# Create your views here.

def index(request):
    return render(request, "flights/index.html", {
        "flights": Flight.objects.all()
    })

def flight(request, flight_id):
    flight = Flight.objects.get(id=flight_id)
    return render(request, "flights/flight.html", {
        "flight": flight,
        #accesses Passengers through related name passengers which is accessible through Flight model
        "passengers": flight.passengers.all(),
        #non_passengers Get all passengers except the ones on the flight
        "non_passengers": Passenger.objects.exclude(flights=flight).all()
    })
    
def book(request, flight_id):
    if request.method == "POST":
        flight = Flight.objects.get(pk=flight_id) #contains info on flight.id
        passenger = Passenger.objects.get(pk=int(request.POST["passenger"])) #contains info on Passenger.id
        passenger.flights.add(flight) # add flight to Passenger
        return HttpResponseRedirect(reverse("flight", args=(flight.id,)))

    