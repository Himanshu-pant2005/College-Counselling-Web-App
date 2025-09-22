from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('seat-matrix/', views.manage_seat_matrix, name='manage_seat_matrix'),
    path('seat-matrix/edit/<int:pk>/', views.edit_seat_matrix, name='edit_seat_matrix'),
    path('seat-matrix/delete/<int:pk>/', views.delete_seat_matrix, name='delete_seat_matrix'),
    path('allot-branch/<int:student_id>/', views.allot_branch, name='allot_branch'),
    path('verify-payment/<int:student_id>/', views.verify_payment, name='verify_payment'),
]