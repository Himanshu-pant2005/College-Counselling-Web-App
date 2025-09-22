from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('profile/', views.profile_form, name='profile_form'),
    path('branch-preference/', views.branch_preference, name='branch_preference'),
    path('branch-acceptance/', views.branch_acceptance, name='branch_acceptance'),
    path('fee-payment/', views.fee_payment, name='fee_payment'),
    path('download-offer-letter/', views.download_offer_letter, name='download_offer_letter'),
]