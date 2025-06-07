from django.contrib import admin
from django.urls import include, path
from users.views import CreateUserView, CustomTokenObtainPairView
from rest_framework import urls
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("users/register/", CreateUserView.as_view(), name="register"),
    path("users/login/", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("users/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("users-auth/", include("rest_framework.urls")),
]
