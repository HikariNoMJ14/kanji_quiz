from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_load_hanzi_data'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hanzi',
            name='pinyin',
        ),
    ]