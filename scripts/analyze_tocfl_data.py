import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load the dataset
print("Loading dataset...")
df = pd.read_csv('./data/tocfl_final.csv')

# Basic dataset properties
print("\n=== BASIC DATASET PROPERTIES ===")
print(f"Dataset shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")
print("\nData types:")
print(df.dtypes)

# Summary statistics
print("\n=== SUMMARY STATISTICS ===")
print(df.describe(include='all'))

# Missing data analysis
print("\n=== MISSING DATA ANALYSIS ===")
missing_data = df.isnull().sum()
missing_percent = (missing_data / len(df)) * 100
missing_df = pd.DataFrame({'Missing Values': missing_data, 'Percentage': missing_percent})
print(missing_df[missing_df['Missing Values'] > 0])

# Check for duplicate entries
print("\n=== DUPLICATE ENTRIES ===")
duplicates = df.duplicated().sum()
print(f"Total duplicate rows: {duplicates}")

if duplicates > 0:
    print("Duplicate rows:")
    print(df[df.duplicated(keep=False)])

# Check for duplicate characters
char_duplicates = df['character'].duplicated().sum()
print(f"\nDuplicate characters: {char_duplicates}")

if char_duplicates > 0:
    print("Rows with duplicate characters:")
    print(df[df['character'].duplicated(keep=False)].sort_values('character'))

# Check for inconsistencies in pinyin
print("\n=== PINYIN INCONSISTENCIES ===")
pinyin_mismatch = df[df['pinyin_1'] != df['pinyin_2']]
print(f"Rows where pinyin_1 and pinyin_2 don't match: {len(pinyin_mismatch)}")
if len(pinyin_mismatch) > 0:
    print(pinyin_mismatch[['number', 'character', 'pinyin_1', 'pinyin_2']])

# Check for unusual values in level
print("\n=== LEVEL DISTRIBUTION ===")
level_counts = df['level'].value_counts().sort_index()
print(level_counts)

# Check for unusual values in english field
print("\n=== ENGLISH FIELD ANALYSIS ===")
# Check if english field contains lists or strings
if isinstance(df['english'].iloc[0], list):
    english_lengths = df['english'].apply(len)
    print("English translations per entry (counts):")
    print(english_lengths.value_counts().sort_index())
else:
    # Check for unusually long or short english translations
    english_lengths = df['english'].astype(str).apply(len)
    print("English translation length statistics:")
    print(english_lengths.describe())
    
    # Check for potentially problematic patterns in english field
    print("\nChecking for potential issues in english field...")
    patterns = [r'\[.*\]', r'\(.*\)', r'see ', r'surname', r'CL:']
    for pattern in patterns:
        matches = df['english'].str.contains(pattern, na=False)
        if matches.any():
            print(f"Entries containing '{pattern}': {matches.sum()}")
            print(df[matches][['number', 'character', 'english']].head(3))

# Check for topic distribution
print("\n=== TOPIC DISTRIBUTION ===")
topic_counts = df['topic'].value_counts()
print(f"Number of unique topics: {len(topic_counts)}")
print(topic_counts.head(10))

# Check for part of speech distribution
print("\n=== PART OF SPEECH DISTRIBUTION ===")
pos_counts = df['part of speech'].value_counts()
print(f"Number of unique parts of speech: {len(pos_counts)}")
print(pos_counts)

# Check for zhuyin formatting
print("\n=== ZHUYIN ANALYSIS ===")
zhuyin_lengths = df['zhuyin'].astype(str).apply(len)
print("Zhuyin length statistics:")
print(zhuyin_lengths.describe())

# Summary of findings
print("\n=== SUMMARY OF FINDINGS ===")
print("1. Dataset shape:", df.shape)
print("2. Missing values:", "Yes" if missing_data.sum() > 0 else "No")
print("3. Duplicate entries:", "Yes" if duplicates > 0 else "No")
print("4. Duplicate characters:", "Yes" if char_duplicates > 0 else "No")
print("5. Pinyin inconsistencies:", "Yes" if len(pinyin_mismatch) > 0 else "No")