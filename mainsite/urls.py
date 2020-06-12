
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name = 'index') ,
    path('table/<table_name>/', views.table,  name ='table'),
    path('register/', views.register, name = 'register')
]

