# Generated by Django 5.0.2 on 2024-03-27 14:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_alter_post_likes'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='text',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]