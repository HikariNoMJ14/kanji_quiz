# backend/api/serializers.py
from rest_framework import serializers
from .models import Hanzi, Translation, Pinyin, Encounter

class TranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Translation
        fields = ['translation']

class PinyinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pinyin
        fields = ['pinyin1', 'pinyin2']

class EncounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Encounter
        fields = ['correct', 'timestamp']

class HanziSerializer(serializers.ModelSerializer):
    translations = TranslationSerializer(many=True, read_only=True)
    pinyins = PinyinSerializer(many=True, read_only=True)
    encounters = EncounterSerializer(many=True, read_only=True)
    proficiency = serializers.SerializerMethodField()

    class Meta:
        model = Hanzi
        fields = ['id', 'hanzi', 'zhuyin', 'topic', 'level', 'pos', 'proficiency', 'translations', 'pinyins', 'encounters']

    def get_proficiency(self, obj):
        return obj.calculate_proficiency()