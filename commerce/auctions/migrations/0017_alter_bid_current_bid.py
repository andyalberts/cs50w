# Generated by Django 5.0.1 on 2024-02-22 15:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0016_bid_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bid',
            name='current_bid',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=7),
        ),
    ]
