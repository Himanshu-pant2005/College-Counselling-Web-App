from django.contrib import admin
from .models import Student

# Custom admin for Student
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'allotted_branch', 'branch_status', 'profile_completed')
    
    # Make allotted_branch a dropdown
    list_editable = ('allotted_branch',)
    
    # Optional: Customize the field labels
    fieldsets = (
        (None, {
            'fields': ('user', 'phone', 'dob', 'profile_completed')
        }),
        ('Academic Details', {
            'fields': ('math_hs', 'science_hs', 'english_hs', 'hindi_hs', 'physics', 'chemistry', 'math_12', 
                       'branch_choice_1', 'branch_choice_2')
        }),
        ('Branch Management', {
            'fields': ('allotted_branch', 'branch_status'),
            'description': 'Admin can assign or update branch here'
        }),
        ('Payment & Offer', {
            'fields': ('payment_receipt', 'payment_verified', 'offer_letter_generated')
        }),
    )
    
    # Rename the 'allotted_branch' label in the admin form
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['allotted_branch'].label = "Allot Branch"
        return form

# Register the model
admin.site.register(Student, StudentAdmin)