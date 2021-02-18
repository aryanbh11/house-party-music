from django.urls import path
from .views import *

urlpatterns = [
    path('', index),
    path('join', index),
    path('create', index)
]