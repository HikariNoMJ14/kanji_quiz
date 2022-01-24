import pandas as pd


def replace(x):
    if x == '準1':
        y = 'Novice 1'
    elif x == '準2':
        y = 'Novice 2'
    elif x == '入':
        y = 'A Level 1'
    elif x == '基':
        y = 'A Level 2'
    elif x == '進':
        y = 'B Level 1'
    elif x == '高':
        y = 'B Level 2'
    elif x == '流':
        y = 'C Level 1'
    else:
        print('error')

    return y


filenames = [
    '準備級一級 (1)',
    '準備級二級 (1)',
    '入門級 (1)',
    '基礎級 (1)',
    '進階級',
    '高階級',
    '流利級'
]

dfs = []

for f in filenames:
    df = pd.read_csv(f'~/Downloads/TOCFL - {f}.csv')
    dfs.append(df)

all_df = pd.concat(dfs, ignore_index=True)

print(all_df.columns)
print(all_df.shape)
print(all_df.head())
print(all_df.index)

all_df.columns = [
    'topic',
    'character',
    'alternative character',
    'pinyin',
    'part of speech',
    'zhuyin',
    'level',
    'number',
    'number 2'
]

all_df.loc[:, 'level 2'] = all_df['level'].str.split('-').str[0]
all_df['level 2'] = all_df['level 2'].apply(replace)

print(all_df['level 2'].value_counts())

# print(all_df['詞類'].value_counts())

all_df.to_csv('~/Downloads/TOCFL_en.csv')
