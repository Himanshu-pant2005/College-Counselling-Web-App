from django.shortcuts import render
from .models import SeatMatrix

def home(request):
    branches = SeatMatrix.objects.all()
    return render(request, 'counselling/home.html', {'branches': branches})

def about(request):
    return render(request, 'counselling/about.html')

def contact(request):
    return render(request, 'counselling/contact.html')