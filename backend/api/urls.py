from django.urls import path
from .views import search_hanzi

urlpatterns = [
    path('search/', search_hanzi, name='search_hanzi'),
]