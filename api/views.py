from django.shortcuts import render
from rest_framework import generics

from .serializers import *
from .models import *


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer