from django.db import models

class SeatMatrix(models.Model):
    branch_name = models.CharField(max_length=100)
    total_seats = models.IntegerField(default=60)
    filled_seats = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.branch_name} - {self.filled_seats}/{self.total_seats}"
    
    def available_seats(self):
        return self.total_seats - self.filled_seats