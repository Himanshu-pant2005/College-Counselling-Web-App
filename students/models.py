from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    phone = models.CharField(max_length=15, blank=True)
    dob = models.DateField(null=True, blank=True)
    
    # High School Marks
    math_hs = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    science_hs = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    english_hs = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    hindi_hs = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    
    # 10+2 Marks
    physics = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    chemistry = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    math_12 = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    
    # Branch Preferences
    BRANCH_CHOICES = [
        ('CSE', 'Computer Science Engineering'),
        ('ECE', 'Electronics & Communication Engineering'),
        ('ME', 'Mechanical Engineering'),
        ('CE', 'Civil Engineering'),
        ('EE', 'Electrical Engineering'),
        ('IT', 'Information Technology'),
    ]
    
    branch_choice_1 = models.CharField(max_length=50, choices=BRANCH_CHOICES, blank=True)
    branch_choice_2 = models.CharField(max_length=50, choices=BRANCH_CHOICES, blank=True)
    
    # Allotted Branch
    allotted_branch = models.CharField(max_length=50, blank=True)
    
    # Branch Acceptance
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('reassignment_requested', 'Reassignment Requested'),
    ]
    branch_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    
    # Payment Receipt
    payment_receipt = models.FileField(upload_to='receipts/', blank=True, null=True)
    payment_verified = models.BooleanField(default=False)
    
    # Offer Letter
    offer_letter_generated = models.BooleanField(default=False)
    
    # Profile Completion
    profile_completed = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"
    
    def total_12_marks(self):
        if all(mark is not None for mark in [self.physics, self.chemistry, self.math_12]):
            return self.physics + self.chemistry + self.math_12
        return None