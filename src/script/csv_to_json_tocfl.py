import pandas as pd
import json

df = pd.read_csv('/media/manu/Data/PycharmProjects/kanji_quiz/data/tocfl_final.csv', index_col=0)

print(df)

j = []

for idx, row in df.iterrows():
    d = [
         row['topic'],
         row['level'],
         row['character'],
         row['zhuyin'],
         row['pinyin'],
         row['number']
    ]
    j.append(d)

json.dump(j, open('/media/manu/Data/PycharmProjects/kanji_quiz/data/TOCFL.json', mode='w+'))

