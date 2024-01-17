from django.urls import path
from . import views


#Empty string is default route, index page
urlpatterns = [
    path("", views.index, name="index")
]