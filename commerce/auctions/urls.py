from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create", views.create_listing, name="create"),
    path("listing/<int:id>", views.listing, name="listing"),
    path("watchlist",views.watchlist, name="watchlist"),
    path("add_rmv_watchlist/<int:id>", views.add_rmv_watchlist, name="add_rmv_watchlist"),
    path("category", views.category, name="category"),
    path("bid/<int:id>", views.place_bid, name="bid"),
    path("toggle_active/<int:id>",views.toggle_active, name="toggle_active")
]
    