# Generated by Django 5.0.1 on 2024-02-23 15:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0020_alter_listing_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
