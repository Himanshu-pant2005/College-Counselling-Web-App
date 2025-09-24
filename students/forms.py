from django import forms
from .models import Student
from django.contrib.auth.models import User

class CreateProfileForm(forms.ModelForm):
    first_name = forms.CharField(max_length=30)
    last_name = forms.CharField(max_length=30)
    email = forms.EmailField(disabled=True)

    class Meta:
        model = Student
        fields = ['phone', 'dob']
        widgets = {
            'dob': forms.DateInput(attrs={'type': 'date'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.user_id:
            self.fields['first_name'].initial = self.instance.user.first_name
            self.fields['last_name'].initial = self.instance.user.last_name
            self.fields['email'].initial = self.instance.user.email

    def save(self, commit=True):
        student = super().save(commit=False)
        student.user.first_name = self.cleaned_data['first_name']
        student.user.last_name = self.cleaned_data['last_name']
        if commit:
            student.user.save()
            student.save()
        return student


# Step 2: Marks + Branch choices
class BranchPreferenceForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = [
            'math_hs', 'science_hs', 'english_hs', 'hindi_hs',
            'physics', 'chemistry', 'math_12',
            'branch_choice_1', 'branch_choice_2'
        ]

class PaymentReceiptForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = ['payment_receipt']
        widgets = {
            'payment_receipt': forms.FileInput(attrs={'accept': 'image/*,.pdf'}),
        }
