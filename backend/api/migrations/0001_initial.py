# Generated by Django 5.1.3 on 2024-11-14 03:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Hanzi',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hanzi', models.CharField(max_length=10)),
                ('zhuyin', models.CharField(max_length=20)),
                ('pinyin', models.CharField(max_length=20)),
                ('topic', models.CharField(blank=True, max_length=50)),
                ('level', models.IntegerField()),
                ('pos', models.CharField(max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='Pinyin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pinyin1', models.CharField(max_length=20)),
                ('pinyin2', models.CharField(max_length=20)),
                ('hanzi', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pinyins', to='api.hanzi')),
            ],
        ),
        migrations.CreateModel(
            name='Translation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('translation', models.CharField(max_length=100)),
                ('hanzi', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='api.hanzi')),
            ],
        ),
    ]
