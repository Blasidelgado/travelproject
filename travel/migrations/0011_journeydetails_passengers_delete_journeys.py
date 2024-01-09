# Generated by Django 4.2.2 on 2024-01-04 15:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('travel', '0010_rename_travel_journeys_alter_journeydetails_driver'),
    ]

    operations = [
        migrations.AddField(
            model_name='journeydetails',
            name='passengers',
            field=models.ManyToManyField(related_name='passenger', to='travel.userprofile'),
        ),
        migrations.DeleteModel(
            name='Journeys',
        ),
    ]