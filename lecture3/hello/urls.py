from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("andy", views.andy, name="andy")
]