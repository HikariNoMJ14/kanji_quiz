import csv
import os
import sqlite3

# Determine CSV path (prefer cleaned file)
CANDIDATE_CSVS = [
    'data/tocfl_cleaned.csv',
    'data/tocfl_clean.csv',
]

csv_path = None
for p in CANDIDATE_CSVS:
    if os.path.exists(p):
        csv_path = p
        break

if not csv_path:
    raise FileNotFoundError("Could not find tocfl_cleaned.csv or tocfl_clean.csv in data/ directory")

# Connect to Django backend SQLite database so the API can serve the data
DB_PATH = os.path.join('backend', 'db.sqlite3')
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Helper to safely get a column by possible names

def get(row, names, default=''):
    for n in names:
        if n in row and row[n] is not None:
            return row[n]
    return default

# Optional: clear existing data to avoid duplicates
cursor.execute('DELETE FROM api_translation')
cursor.execute('DELETE FROM api_pinyin')
cursor.execute('DELETE FROM api_encounter')
cursor.execute('DELETE FROM api_hanzi')

# Insert data into tables from CSV
with open(csv_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        hanzi = get(row, ['traditional', 'character', 'hanzi']).strip()
        if not hanzi:
            continue
        zhuyin = get(row, ['zhuyin']).strip()
        topic = get(row, ['topic']).strip()
        # level may be numeric text
        level_raw = get(row, ['level']).strip()
        try:
            level = int(level_raw) if level_raw else 0
        except ValueError:
            level = 0
        pos = get(row, ['part of speech', 'pos']).strip()

        # Insert into Django api_hanzi table
        cursor.execute(
            '''INSERT INTO api_hanzi (hanzi, zhuyin, topic, level, pos) VALUES (?, ?, ?, ?, ?)''',
            (hanzi, zhuyin, topic, level, pos)
        )
        hanzi_id = cursor.lastrowid

        # Insert Pinyin (columns may vary across datasets) into api_pinyin
        p1 = get(row, ['pinyin_1', 'pinyin_x', 'pinyin1']).strip()
        p2 = get(row, ['pinyin_2', 'pinyin_y', 'pinyin2']).strip()
        if p1 or p2:
            cursor.execute(
                '''INSERT INTO api_pinyin (hanzi_id, pinyin1, pinyin2) VALUES (?, ?, ?)''',
                (hanzi_id, p1, p2)
            )

        # Insert Translations (assume semicolon or comma separated) into api_translation
        english = get(row, ['english']).strip()
        if english:
            # Normalize separators ; or ,
            if ';' in english:
                chunks = english.split(';')
            else:
                chunks = english.split(',')
            parts = [p.strip() for p in chunks]
            for trans in parts:
                if trans:
                    cursor.execute(
                        '''INSERT INTO api_translation (hanzi_id, translation) VALUES (?, ?)''',
                        (hanzi_id, trans)
                    )

# Commit changes and close connection
conn.commit()
conn.close()