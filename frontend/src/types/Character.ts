export interface Character {
    id: number;
    hanzi: string;
    zhuyin: string[];
    english: string[];
    mastery: number;
    lastSeen?: number;
    level?: number;
    round?: number; // Added round to interface
}