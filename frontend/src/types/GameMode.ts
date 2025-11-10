export interface GameMode {
    id: string;
    label: string;
    from: string;
    to: string;
}

export const GAME_MODES: GameMode[] = [
    {id: 'hanzi-to-zhuyin', label: 'Hanzi → Zhuyin', from: 'hanzi', to: 'zhuyin'},
    {id: 'hanzi-to-english', label: 'Hanzi → English', from: 'hanzi', to: 'english'},
    {id: 'zhuyin-to-hanzi', label: 'Zhuyin → Hanzi', from: 'zhuyin', to: 'hanzi'},
    {id: 'zhuyin-to-english', label: 'Zhuyin → English', from: 'zhuyin', to: 'english'},
    {id: 'english-to-hanzi', label: 'English → Hanzi', from: 'english', to: 'hanzi'},
    {id: 'english-to-zhuyin', label: 'English → Zhuyin', from: 'english', to: 'zhuyin'}
];