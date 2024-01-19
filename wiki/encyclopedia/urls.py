from django.urls import path
from .views import entry_page
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:title>/", entry_page, name=entry_page)
]
