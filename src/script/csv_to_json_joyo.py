import pandas as pd
import json

df = pd.read_csv('/media/manu/Data/PycharmProjects/kanji_quiz/data/joyo.csv', index_col=0)

# print(df)

j = []

for idx, row in df.iterrows():
    d = [
         row['New'],
         row['Old'],
         row['Radical'],
         row['Strokes'],
         row['Grade'],
         row['Year added'],
         row['English meaning']
    ]

    for r in row['Readings'].split('、'):
        d.append(r)

    j.append(d)

json.dump(j, open('/media/manu/Data/PycharmProjects/kanji_quiz/data/joyo.json', mode='w+'))

