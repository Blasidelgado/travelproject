from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('api/users', views.handle_users, name="users"),
    path('api/users/<str:username>/', views.handle_users, name="user"),
    path('api/login', views.handle_login, name="login"),
    path('api/logout', views.handle_logout, name="logout"),
    path('api/session', views.handle_session, name="session"),
    path('api/permissions', views.handle_permissions, name="permissions"),
    path('api/cities', views.handle_cities, name="permissions"),
    path('api/travel', views.handle_travel, name="travel"),
    path('api/travel/<str:origin_city>/<str:destination_city>/', views.handle_travel, name="travel_query"),
    path('api/travel/<int:journey_id>/', views.handle_travel, name="retrieve_journey"),
    path('api/travel/user_journeys/', views.retrieve_user_journeys, name="user_journeys")
]
