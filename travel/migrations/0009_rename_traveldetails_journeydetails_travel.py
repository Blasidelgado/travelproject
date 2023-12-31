# Generated by Django 4.2.2 on 2023-12-31 14:41

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('travel', '0008_traveldetails_delete_travel'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='TravelDetails',
            new_name='JourneyDetails',
        ),
        migrations.CreateModel(
            name='Travel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('journey', models.ManyToManyField(related_name='selected_journey', to='travel.journeydetails')),
                ('passengers', models.ManyToManyField(related_name='passenger', to='travel.userprofile')),
            ],
        ),
    ]
