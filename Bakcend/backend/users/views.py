from urllib import request
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import CustomTokenObtainPairSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from django import http


@method_decorator(csrf_protect, name="dispatch")
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@method_decorator(csrf_protect, name="dispatch")
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@csrf_exempt
def GetCsrfToken(request):
    token = get_token(request)
    return http.HttpResponse(token)