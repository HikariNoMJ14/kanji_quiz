# backend/api/models.py
from django.db import models

class Hanzi(models.Model):
    hanzi = models.CharField(max_length=10)
    zhuyin = models.CharField(max_length=20)
    topic = models.CharField(max_length=50, blank=True)
    level = models.IntegerField()
    pos = models.CharField(max_length=10)

    def calculate_proficiency(self):
        encounters = self.encounters.order_by('-id')[:5]
        if not encounters:
            return 0
        return sum(encounter.correct for encounter in encounters) / len(encounters)

class Encounter(models.Model):
    hanzi = models.ForeignKey(Hanzi, related_name='encounters', on_delete=models.CASCADE)
    correct = models.BooleanField()
    timestamp = models.DateTimeField(auto_now_add=True)

class Translation(models.Model):
    hanzi = models.ForeignKey(Hanzi, related_name='translations', on_delete=models.CASCADE)
    translation = models.CharField(max_length=100)

class Pinyin(models.Model):
    hanzi = models.ForeignKey(Hanzi, related_name='pinyins', on_delete=models.CASCADE)
    pinyin1 = models.CharField(max_length=20)
    pinyin2 = models.CharField(max_length=20)