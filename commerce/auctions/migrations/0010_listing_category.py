# Generated by Django 5.0.1 on 2024-02-10 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0009_rename_watch_list_user_watchlist'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='category',
            field=models.CharField(blank=True, max_length=45, null=True),
        ),
    ]
