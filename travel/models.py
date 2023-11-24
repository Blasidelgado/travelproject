from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    license = models.CharField(max_length=30, blank=True, null=True)
    car = models.OneToOneField('Car', blank=True, null=True, on_delete=models.SET_NULL)
    description = models.TextField(max_length=200, blank=True, null=True)

    def has_license(self):
        return self.license is not None
    
    def has_car(self):
        return self.car is not None

    def to_json(self):
        return {
            'username': self.user.username,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'license': self.license,
            'car': {
                'plate_number': self.car.plate_number if self.car else None,
                'brand': self.car.brand if self.car else None,
                'model': self.car.model if self.car else None,
            } if self.has_car() else None
        }


class Car(models.Model):
    plate_number = models.CharField(null=False, max_length=40)
    brand = models.CharField(null=False, max_length=30)
    model = models.CharField(null=False, max_length=30)
