# Generated by Django 5.0.2 on 2024-05-22 15:15

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0012_remove_post_likes_post_likes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='likes',
            field=models.ManyToManyField(blank=True, null=True, related_name='liked', to=settings.AUTH_USER_MODEL),
        ),
    ]
