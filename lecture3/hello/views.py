from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
def index(request):
    return HttpResponse("Hello!")

def andy(request):
    return HttpResponse("Hello, Andy!")

def lux(request):
    return HttpResponse("Hello, lux!")

def greet(request, name):
    return HttpResponse(f"Hello, {name}!")