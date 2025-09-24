from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home, name='home'),
    path('branch-preference/', views.branch_preference, name='branch_preference'),
    path('branch-acceptance/', views.branch_acceptance, name='branch_acceptance'),
    path('fee-payment/', views.fee_payment, name='fee_payment'),
    path('download-offer-letter/', views.download_offer_letter, name='download_offer_letter'),
    path('profile/create/', views.create_profile, name='create_profile'),
    path('profile/marks/', views.branch_preference, name='branch_preference'),
]