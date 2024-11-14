from rest_framework import serializers
from .models import Hanzi, Translation, Pinyin

class TranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Translation
        fields = ['translation']

class PinyinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pinyin
        fields = ['pinyin1', 'pinyin2']

class HanziSerializer(serializers.ModelSerializer):
    translations = TranslationSerializer(many=True, read_only=True)
    pinyins = PinyinSerializer(many=True, read_only=True)

    class Meta:
        model = Hanzi
        fields = ['hanzi', 'zhuyin', 'pinyin', 'topic', 'level', 'pos', 'translations', 'pinyins']