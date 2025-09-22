from django.contrib import admin
from .models import SeatMatrix

@admin.register(SeatMatrix)
class SeatMatrixAdmin(admin.ModelAdmin):
    list_display = ('branch_name', 'total_seats', 'filled_seats', 'available_seats')
    search_fields = ('branch_name',)