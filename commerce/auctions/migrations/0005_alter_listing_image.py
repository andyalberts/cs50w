# Generated by Django 5.0.1 on 2024-02-26 14:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0004_alter_listing_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='image',
            field=models.ImageField(blank=True, default='media/media/noimage.png', null=True, upload_to='media'),
        ),
    ]
