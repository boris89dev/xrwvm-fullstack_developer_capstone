from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.timezone import now


# Car Make model
class CarMake(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()

    def __str__(self):
        return f"{self.name} - {self.description[:30]}..."


# Car Model model
class CarModel(models.Model):
    SEDAN = 'Sedan'
    SUV = 'SUV'
    WAGON = 'Wagon'
    CHOICES = [
        (SEDAN, 'Sedan'),
        (SUV, 'SUV'),
        (WAGON, 'Wagon'),
    ]

    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name='models')
    dealer_id = models.IntegerField(default=0)
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=10, choices=CHOICES)
    year = models.IntegerField(validators=[MinValueValidator(2015), MaxValueValidator(2023)])

    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.year})"
