# Generated by Django 5.0.1 on 2024-02-26 14:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0018_alter_listing_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='image',
            field=models.ImageField(default='defaultimg.png', upload_to='media'),
        ),
    ]
