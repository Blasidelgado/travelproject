from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    license = models.CharField(max_length=30, blank=True, null=True)
    car = models.OneToOneField('Car', blank=True, null=True, on_delete=models.SET_NULL)

    def has_license(self):
        return self.license is not None
    
    def has_car(self):
        return self.car is not None


class Car(models.Model):
    plate_number = models.CharField(null=False, max_length=40)
    brand = models.CharField(null=False, max_length=30)
    model = models.CharField(null=False, max_length=30)
