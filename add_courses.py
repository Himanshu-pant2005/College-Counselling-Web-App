import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'college_counselling.settings')
django.setup()

from counselling.models import SeatMatrix

# Clear existing data
SeatMatrix.objects.all().delete()

# Add B.Tech courses with branches
SeatMatrix.objects.create(branch_name="B.Tech - CSE", total_seats=60)
SeatMatrix.objects.create(branch_name="B.Tech - ECE", total_seats=60)

# Add BCA course
SeatMatrix.objects.create(branch_name="BCA", total_seats=60)

# Add MCA course
SeatMatrix.objects.create(branch_name="MCA", total_seats=60)

print("Courses and branches added successfully!")