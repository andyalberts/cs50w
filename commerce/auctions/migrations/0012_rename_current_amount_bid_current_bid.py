# Generated by Django 5.0.1 on 2024-02-12 18:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0011_rename_bid_amount_bid_current_amount'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bid',
            old_name='current_amount',
            new_name='current_bid',
        ),
    ]
