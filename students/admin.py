from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'branch_status', 'allotted_branch', 'profile_completed')
    list_filter = ('branch_status', 'profile_completed')
    search_fields = ('user__email', 'user__username')