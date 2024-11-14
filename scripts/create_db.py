import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('local_database.db')
cursor = conn.cursor()

# Create table
cursor.execute('''
CREATE TABLE Hanzi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hanzi TEXT NOT NULL,
    zhuyin TEXT,
    topic TEXT,
    level INTEGER,
    pos TEXT
);

''')

cursor.execute('''
CREATE TABLE Translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hanzi_id INTEGER,
    translation TEXT,
    FOREIGN KEY (hanzi_id) REFERENCES Hanzi(id)
);
''')

cursor.execute('''

CREATE TABLE Pinyin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hanzi_id INTEGER,
    pinyin1 TEXT,
    pinyin2 TEXT,
    FOREIGN KEY (hanzi_id) REFERENCES Hanzi(id)
);
''')


# Commit changes and close connection
conn.commit()
conn.close()