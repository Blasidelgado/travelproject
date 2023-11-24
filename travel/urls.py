from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('api/users', views.handle_users, name="users"),
    path('api/users/<str:username>/', views.handle_users, name="user"),
    path('api/login', views.handle_login, name="login"),
    path('api/logout', views.handle_logout, name="logout"),
    path('api/session', views.handle_session, name="session")
]
