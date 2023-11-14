from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('api.users', views.handle_users, name="users")
]
