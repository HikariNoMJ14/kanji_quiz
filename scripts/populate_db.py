import json
import sqlite3

# Path to the JSON file
file_path = 'data/hanzi_data.json'

# Read and parse the JSON data
with open(file_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

# Connect to SQLite database
conn = sqlite3.connect('local_database.db')
cursor = conn.cursor()

# Insert data into tables
for entry in data:
    # Insert into Hanzi table
    cursor.execute('''
    INSERT INTO Hanzi (hanzi, zhuyin, topic, level, pos)
    VALUES (?, ?, ?, ?, ?)
    ''', (
        entry['hanzi'],
        entry['zhuyin'],
        entry['topic'],
        entry['level'],
        entry['pos']
    ))
    hanzi_id = cursor.lastrowid

    # Insert into Translations table
    for translation in entry['translations']:
        cursor.execute('''
        INSERT INTO Translations (hanzi_id, translation)
        VALUES (?, ?)
        ''', (hanzi_id, translation))

    # Insert into Pinyin table
    cursor.execute('''
    INSERT INTO Pinyin (hanzi_id, pinyin1, pinyin2)
    VALUES (?, ?, ?)
    ''', (
        hanzi_id,
        entry['pinyin1'],
        entry['pinyin2']
    ))

# Commit changes and close connection
conn.commit()
conn.close()