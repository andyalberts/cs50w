# Generated by Django 5.0.2 on 2024-06-28 13:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0015_comments'),
    ]

    operations = [
        migrations.AddField(
            model_name='comments',
            name='texingt',
            field=models.CharField(blank=True, max_length=420),
        ),
    ]
