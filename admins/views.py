from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from students.models import Student
from counselling.models import SeatMatrix
from django.core.mail import send_mail
from django.conf import settings

def is_admin(user):
    return user.is_staff

@login_required
@user_passes_test(is_admin)
def admin_dashboard(request):
    students = Student.objects.filter(profile_completed=True).order_by('-physics', '-chemistry', '-math_12')
    seat_matrix = SeatMatrix.objects.all()
    
    context = {
        'students': students,
        'seat_matrix': seat_matrix,
    }
    return render(request, 'admins/dashboard.html', context)

@login_required
@user_passes_test(is_admin)
def manage_seat_matrix(request):
    seat_matrix = SeatMatrix.objects.all()
    
    if request.method == 'POST':
        branch_name = request.POST.get('branch_name')
        total_seats = request.POST.get('total_seats')
        
        if branch_name and total_seats:
            SeatMatrix.objects.create(
                branch_name=branch_name,
                total_seats=total_seats
            )
            messages.success(request, 'Branch added successfully!')
            return redirect('manage_seat_matrix')
    
    return render(request, 'admins/seat_matrix.html', {'seat_matrix': seat_matrix})

@login_required
@user_passes_test(is_admin)
def edit_seat_matrix(request, pk):
    seat = get_object_or_404(SeatMatrix, pk=pk)
    
    if request.method == 'POST':
        seat.branch_name = request.POST.get('branch_name')
        seat.total_seats = request.POST.get('total_seats')
        seat.save()
        messages.success(request, 'Branch updated successfully!')
        return redirect('manage_seat_matrix')
    
    return render(request, 'admins/edit_seat_matrix.html', {'seat': seat})

@login_required
@user_passes_test(is_admin)
def delete_seat_matrix(request, pk):
    seat = get_object_or_404(SeatMatrix, pk=pk)
    seat.delete()
    messages.success(request, 'Branch deleted successfully!')
    return redirect('manage_seat_matrix')

@login_required
@user_passes_test(is_admin)
def allot_branch(request, student_id):
    student = get_object_or_404(Student, id=student_id)
    seat_matrix = SeatMatrix.objects.all()
    
    if request.method == 'POST':
        branch = request.POST.get('branch')
        if branch:
            student.allotted_branch = branch
            student.branch_status = 'pending'
            student.save()
            
            # Update seat matrix
            seat = SeatMatrix.objects.get(branch_name=branch)
            seat.filled_seats += 1
            seat.save()
            
            # Send email notification
            subject = 'Branch Allotment Notification'
            message = f'Dear {student.user.first_name},\n\nYou have been allotted {branch} branch. Please login to your account to accept or request reassignment.\n\nRegards,\nCollege Counselling Team'
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [student.user.email]
            
            try:
                send_mail(subject, message, from_email, recipient_list)
            except Exception as e:
                print(f"Email sending failed: {e}")
            
            messages.success(request, f'Branch {branch} allotted to {student.user.first_name} successfully!')
            return redirect('admin_dashboard')
    
    return render(request, 'admins/allot_branch.html', {'student': student, 'seat_matrix': seat_matrix})

@login_required
@user_passes_test(is_admin)
def verify_payment(request, student_id):
    student = get_object_or_404(Student, id=student_id)
    
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'approve':
            student.payment_verified = True
            student.offer_letter_generated = True
            student.save()
            
            # Send email notification
            subject = 'Payment Verification and Offer Letter'
            message = f'Dear {student.user.first_name},\n\nYour payment has been verified successfully. Your offer letter is now available for download from your dashboard.\n\nRegards,\nCollege Counselling Team'
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [student.user.email]
            
            try:
                send_mail(subject, message, from_email, recipient_list)
            except Exception as e:
                print(f"Email sending failed: {e}")
            
            messages.success(request, f'Payment verified for {student.user.first_name}!')
        elif action == 'reject':
            student.payment_receipt = None
            student.save()
            
            # Send email notification
            subject = 'Payment Verification Failed'
            message = f'Dear {student.user.first_name},\n\nYour payment verification has failed. Please upload a valid payment receipt.\n\nRegards,\nCollege Counselling Team'
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [student.user.email]
            
            try:
                send_mail(subject, message, from_email, recipient_list)
            except Exception as e:
                print(f"Email sending failed: {e}")
            
            messages.error(request, f'Payment rejected for {student.user.first_name}!')
        
        return redirect('admin_dashboard')
    
    return render(request, 'admins/verify_payment.html', {'student': student})