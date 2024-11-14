from django.db import migrations
import json
import os

def load_hanzi_data(apps, schema_editor):
    Hanzi = apps.get_model('api', 'Hanzi')
    Translation = apps.get_model('api', 'Translation')
    Pinyin = apps.get_model('api', 'Pinyin')
    file_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'data', 'hanzi_data.json')

    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        for entry in data:
            hanzi_instance = Hanzi.objects.create(
                hanzi=entry['hanzi'],
                zhuyin=entry['zhuyin'],
                topic=entry['topic'],
                level=entry['level'],
                pos=entry['pos']
            )

            for translation in entry['translations']:
                Translation.objects.create(
                    hanzi=hanzi_instance,
                    translation=translation
                )

            Pinyin.objects.create(
                hanzi=hanzi_instance,
                pinyin1=entry['pinyin1'],
                pinyin2=entry['pinyin2']
            )

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(load_hanzi_data),
    ]