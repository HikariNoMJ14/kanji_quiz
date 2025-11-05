import pandas as pd
import re

# Load the dataset
print("Loading dataset...")
df = pd.read_csv('./data/tocfl_final.csv')

print("\n=== DETAILED INCONSISTENCY ANALYSIS ===")

# 1. Pinyin inconsistencies (more detailed analysis)
print("\n1. PINYIN INCONSISTENCIES")
pinyin_mismatch = df[df['pinyin_1'] != df['pinyin_2']]
print(f"Found {len(pinyin_mismatch)} rows where pinyin_1 and pinyin_2 don't match:")
for idx, row in pinyin_mismatch.iterrows():
    print(f"  Row {idx}: Character '{row['character']}' has pinyin_1='{row['pinyin_1']}' and pinyin_2='{row['pinyin_2']}'")
    # Check tone differences
    tones1 = re.findall(r'[1-5]', row['pinyin_1'])
    tones2 = re.findall(r'[1-5]', row['pinyin_2'])
    if tones1 != tones2:
        print(f"    Tone difference: {tones1} vs {tones2}")
    
    # Check syllable differences
    syllables1 = re.sub(r'[1-5]', '', row['pinyin_1'])
    syllables2 = re.sub(r'[1-5]', '', row['pinyin_2'])
    if syllables1 != syllables2:
        print(f"    Syllable difference: {syllables1} vs {syllables2}")

# 2. English field formatting issues
print("\n2. ENGLISH FIELD FORMATTING ISSUES")

# Check for bracketed content
bracketed = df[df['english'].str.contains(r'\[.*?\]', na=False)]
print(f"Found {len(bracketed)} entries with bracketed content [...]")
for idx, row in bracketed.head(5).iterrows():
    brackets = re.findall(r'\[.*?\]', row['english'])
    print(f"  Row {idx}: Character '{row['character']}' has bracketed content: {brackets}")

# Check for parenthesized content
parenthesized = df[df['english'].str.contains(r'\(.*?\)', na=False)]
print(f"\nFound {len(parenthesized)} entries with parenthesized content (...)")
for idx, row in parenthesized.head(5).iterrows():
    parens = re.findall(r'\(.*?\)', row['english'])
    print(f"  Row {idx}: Character '{row['character']}' has parenthesized content: {parens}")

# Check for CL: patterns (classifier indicators)
cl_patterns = df[df['english'].str.contains('CL:', na=False)]
print(f"\nFound {len(cl_patterns)} entries with 'CL:' patterns")
for idx, row in cl_patterns.head(5).iterrows():
    cl = re.findall(r'CL:.*?(?:,|\]|$)', row['english'])
    print(f"  Row {idx}: Character '{row['character']}' has classifier: {cl}")

# 3. Zhuyin formatting issues
print("\n3. ZHUYIN FORMATTING ISSUES")
# Check for unusually long or short zhuyin
zhuyin_lengths = df['zhuyin'].astype(str).apply(len)
long_zhuyin = df[zhuyin_lengths > 8]
print(f"Found {len(long_zhuyin)} entries with unusually long zhuyin (>8 characters)")
for idx, row in long_zhuyin.iterrows():
    print(f"  Row {idx}: Character '{row['character']}' has zhuyin '{row['zhuyin']}' (length {len(row['zhuyin'])})")

# 4. Topic and part of speech consistency
print("\n4. TOPIC AND PART OF SPEECH CONSISTENCY")
# Check if all entries with the same topic have consistent parts of speech
topic_pos = df.groupby('topic')['part of speech'].nunique()
inconsistent_topics = topic_pos[topic_pos > 1]
print(f"Found {len(inconsistent_topics)} topics with multiple parts of speech:")
for topic, count in inconsistent_topics.items():
    pos_list = df[df['topic'] == topic]['part of speech'].unique()
    print(f"  Topic '{topic}' has {count} different parts of speech: {', '.join(pos_list)}")

# 5. Check for potential errors in English translations
print("\n5. POTENTIAL ERRORS IN ENGLISH TRANSLATIONS")
# Check for very short English translations (might be incomplete)
short_english = df[df['english'].astype(str).apply(len) < 10]
print(f"Found {len(short_english)} entries with very short English translations (<10 chars)")
for idx, row in short_english.iterrows():
    print(f"  Row {idx}: Character '{row['character']}' has short English: '{row['english']}'")

# Check for potentially truncated English translations
truncated = df[df['english'].str.endswith(('...', '…', ',', ';'), na=False)]
print(f"\nFound {len(truncated)} entries with potentially truncated English translations")
for idx, row in truncated.iterrows():
    print(f"  Row {idx}: Character '{row['character']}' has potentially truncated English: '{row['english']}'")

# 6. Summary of findings
print("\n=== SUMMARY OF INCONSISTENCIES AND ANOMALIES ===")
print(f"1. Pinyin inconsistencies: {len(pinyin_mismatch)} entries")
print(f"2. Bracketed content in English: {len(bracketed)} entries")
print(f"3. Parenthesized content in English: {len(parenthesized)} entries")
print(f"4. 'CL:' patterns in English: {len(cl_patterns)} entries")
print(f"5. Unusually long zhuyin: {len(long_zhuyin)} entries")
print(f"6. Topics with inconsistent parts of speech: {len(inconsistent_topics)} topics")
print(f"7. Very short English translations: {len(short_english)} entries")
print(f"8. Potentially truncated English translations: {len(truncated)} entries")