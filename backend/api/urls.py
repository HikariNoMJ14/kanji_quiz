from django.urls import path
from .views import search_hanzi, hanzi_detail

urlpatterns = [
    path('search/', search_hanzi, name='search_hanzi'),
    path('hanzi/<int:id>', hanzi_detail, name='hanzi_detail'),
]