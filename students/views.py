from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Student
from .forms import CreateProfileForm, BranchPreferenceForm, PaymentReceiptForm
from counselling.models import SeatMatrix
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from io import BytesIO
import os

@login_required
def home(request):
    student = None
    if request.user.is_authenticated:
        try:
            student = Student.objects.get(user=request.user)
        except Student.DoesNotExist:
            student = None
    branches = SeatMatrix.objects.all()
    steps = [
        {'num': 1, 'title': 'Registration', 'desc': 'Complete your profile.', 'url': 'create_profile'},
        {'num': 2, 'title': 'Branch Selection', 'desc': 'Select branch preferences.', 'url': 'branch_preference'},
        {'num': 3, 'title': 'Branch Allotment', 'desc': 'Accept or request reassignment.', 'url': 'branch_acceptance'},
        {'num': 4, 'title': 'Fee Payment', 'desc': 'Upload payment receipt.', 'url': 'fee_payment'},
        {'num': 5, 'title': 'Offer Letter', 'desc': 'Download after payment verification.', 'url': 'download_offer_letter'},
    ]

    context = {
        'student': student,
        'branches': branches,
        'steps': steps,
    }

    return render(request, 'counselling/home.html', context)
@login_required
def create_profile(request):
    try:
        student = Student.objects.get(user=request.user)
        if student.phone and student.dob:  
            return redirect('branch_preference')
    except Student.DoesNotExist:
        student = Student(user=request.user)

    if request.method == 'POST':
        form = CreateProfileForm(request.POST, instance=student)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile created successfully!')
            return redirect('branch_preference')
    else:
        form = CreateProfileForm(instance=student)

    return render(request, 'students/create_profile.html', {'form': form})


@login_required
def branch_preference(request):
    try:
        student = Student.objects.get(user=request.user)
    except Student.DoesNotExist:
        return redirect('create_profile')

    if request.method == 'POST':
        form = BranchPreferenceForm(request.POST, instance=student)
        if form.is_valid():
            student = form.save(commit=False)
            student.profile_completed = True
            student.save()
            messages.success(request, 'Marks and preferences saved successfully!')
            return redirect('branch_acceptance')
    else:
        form = BranchPreferenceForm(instance=student)

    return render(request, 'students/branch_preference.html', {'form': form})

@login_required
def branch_acceptance(request):
    try:
        student = Student.objects.get(user=request.user)
    except Student.DoesNotExist:
        return redirect('profile_form')
    
    if not student.allotted_branch:
        messages.error(request, 'No branch has been allotted to you yet.')
        return redirect('home')
    
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'accept':
            student.branch_status = 'accepted'
            student.save()
            messages.success(request, 'Branch accepted successfully! Please proceed to fee payment.')
            return redirect('fee_payment')
        elif action == 'reject':
            student.branch_status = 'reassignment_requested'
            student.save()
            messages.info(request, 'Reassignment requested. You will be notified once processed.')
            return redirect('dashboard')
    
    return render(request, 'students/branch_acceptance.html', {'student': student})

@login_required
def fee_payment(request):
    try:
        student = Student.objects.get(user=request.user)
    except Student.DoesNotExist:
        return redirect('profile_form')
    
    if student.branch_status != 'accepted':
        messages.error(request, 'You need to accept your branch allocation before proceeding to payment.')
        return redirect('dashboard')
    
    if request.method == 'POST':
        if 'payment_receipt' in request.FILES:
            student.payment_receipt = request.FILES['payment_receipt']
            student.save()
            messages.success(request, 'Payment receipt uploaded successfully! It will be verified soon.')
            return redirect('dashboard')
    
    return render(request, 'students/fee_payment.html', {'student': student})

@login_required
def download_offer_letter(request):
    try:
        student = Student.objects.get(user=request.user)
    except Student.DoesNotExist:
        return redirect('profile_form')
    
    if not student.payment_verified or not student.offer_letter_generated:
        messages.error(request, 'Your payment has not been verified or offer letter has not been generated yet.')
        return redirect('dashboard')
    
    # Create a BytesIO buffer
    buffer = BytesIO()
    
    # Create the PDF object using the BytesIO buffer
    p = canvas.Canvas(buffer, pagesize=letter)
    
    # Draw on the PDF
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, 750, "COLLEGE ADMISSION OFFER LETTER")
    
    p.setFont("Helvetica", 12)
    p.drawString(100, 700, f"Date: {student.user.date_joined.strftime('%d-%m-%Y')}")
    p.drawString(100, 670, f"Student Name: {student.user.first_name} {student.user.last_name}")
    p.drawString(100, 640, f"Email: {student.user.email}")
    
    p.setFont("Helvetica-Bold", 14)
    p.drawString(100, 600, "BRANCH ALLOTMENT")
    
    p.setFont("Helvetica", 12)
    p.drawString(100, 570, f"Allotted Branch: {student.allotted_branch}")
    
    p.setFont("Helvetica-Bold", 14)
    p.drawString(100, 520, "COLLEGE DETAILS")
    
    p.setFont("Helvetica", 12)
    p.drawString(100, 490, "College Name: XYZ Engineering College")
    p.drawString(100, 460, "Address: 123 College Road, City, State, PIN")
    p.drawString(100, 430, "Contact: +91 1234567890")
    
    p.setFont("Helvetica-Bold", 12)
    p.drawString(100, 380, "Important Instructions:")
    
    p.setFont("Helvetica", 10)
    p.drawString(120, 360, "1. Please report to the college on the specified date with all original documents.")
    p.drawString(120, 340, "2. Bring a copy of this offer letter during admission.")
    p.drawString(120, 320, "3. Hostel accommodation will be provided on first-come-first-serve basis.")
    
    p.setFont("Helvetica-Bold", 12)
    p.drawString(100, 250, "Congratulations on your admission!")
    
    p.setFont("Helvetica", 10)
    p.drawString(100, 100, "This is a computer-generated document and does not require a signature.")
    
    # Close the PDF object
    p.showPage()
    p.save()
    
    # Get the value of the BytesIO buffer
    pdf = buffer.getvalue()
    buffer.close()
    
    # Create the HttpResponse with PDF
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="offer_letter_{student.user.username}.pdf"'
    response.write(pdf)
    
    return response