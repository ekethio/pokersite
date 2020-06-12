from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, logout
from django.urls import reverse
from .models import Table 

# Create your views here.


def index(request):

  tables = Table.objects.all()
  
  return render(request, 'index.html', context ={'tables': tables})
def register(request):  
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect(reverse('index'))
        else:       
            return (render (request, 'register.html',context={'form':form}))
    form = UserCreationForm
    return (render (request, 'register.html',context =  {'form':form}))
        
    
        
def table(request, table_name):
    return render(request, 'table.html', context = {'table': table_name})