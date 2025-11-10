import {Character} from "./Character";
import {GameMode} from "./GameMode";


export interface GameRound {
    character: Character;
    options: Character[];
    answered: boolean;
    correct: boolean;
}

export interface GameState {
    rounds: GameRound[];
    currentRound: number;
    score: number;
    gameMode: GameMode;
    gameLength: number;
    numOptions: number;
    difficulty: number;
    round: number; // Added round to interface
}

