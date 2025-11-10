import {Character} from "../types/Character";
import {GameMode} from "../types/GameMode";
import {GameState} from "../types/GameState";

// Resolve difficulty for a given round from characters' level (round,difficulty tuple) with fallback
export const getDifficultyForRound = (characters: Character[], roundNumber: number): number => {
    // Find any character with this round that has a numeric level; assume level == difficulty
    const match = characters.find(c => c.round === roundNumber && typeof c.level === 'number');
    if (match && typeof match.level === 'number') {
        return match.level as number;
    }
    // Fallback heuristic if not found
    return Math.max(1, Math.ceil(roundNumber / 5));
};

// Select characters for a game from the provided list without using React state
export const selectCharactersForGame = (
    gameLength: number,
    roundNumber: number,
    characters: Character[]
): Character[] => {
    // Filter characters that match the selected round
    const filteredByRound = characters.filter(char => char.round === roundNumber);

    // If we don't have enough characters at the exact round,
    // include characters from adjacent rounds
    let availableChars = [...filteredByRound];
    let offset = 1;

    // Keep expanding to adjacent rounds until we have enough or we've exhausted possibilities
    while (availableChars.length < gameLength) {
        const higherRoundChars = characters.filter(char => char.round === roundNumber + offset);
        const lowerRoundChars = characters.filter(char => char.round === roundNumber - offset);

        if (higherRoundChars.length === 0 && lowerRoundChars.length === 0) break;

        availableChars = [...availableChars, ...higherRoundChars, ...lowerRoundChars];
        offset++;
    }

    // Prioritize characters with lower mastery, then by least recently seen
    const sorted = availableChars.sort((a, b) => {
        const aMastery = a.mastery ?? 0;
        const bMastery = b.mastery ?? 0;
        if (aMastery !== bMastery) return aMastery - bMastery;
        const aLastSeen = a.lastSeen ?? 0;
        const bLastSeen = b.lastSeen ?? 0;
        return aLastSeen - bLastSeen;
    });

    return sorted.slice(0, gameLength);
};

// Initialize a new game by computing rounds and setting state via provided setters
export const startGame = (
    gameLength: number,
    numOptions: number,
    gameMode: GameMode,
    round: number,
    characters: Character[],
    setGameState: (gs: GameState | ((prev: GameState | null) => GameState | null)) => void,
    setCurrentPage: (page: 'home' | 'game' | 'search') => void
) => {
    const selectedChars = selectCharactersForGame(gameLength, round, characters);
    const rounds = selectedChars.map(char => ({
        character: char,
        options: generateOptions(char, gameMode, numOptions, characters),
        answered: false,
        correct: false
    }));

    // Determine difficulty for the chosen round from character data (round→difficulty tuple via level), fallback to formula
    const determinedDifficulty = getDifficultyForRound(characters, round);

    setGameState({
        rounds,
        currentRound: 0,
        score: 0,
        gameMode,
        gameLength,
        numOptions,
        difficulty: determinedDifficulty,
        round
    });
    setCurrentPage('game');
};

// Generate options for a given target character without using React state
export const generateOptions = (
    targetChar: Character,
    gameMode: GameMode,
    numOptions: number,
    characters: Character[]
): Character[] => {
    const {from, to} = gameMode;
    const options: Character[] = [targetChar];

    // Get available characters excluding the target
    const available = characters.filter(c => c.id !== targetChar.id);

    // Shuffle and try to add non-conflicting options
    const shuffled = [...available].sort(() => Math.random() - 0.5);

    for (const candidate of shuffled) {
        if (options.length >= numOptions) break;

        // Check for conflicts based on game mode
        let hasConflict = false;

        if (to === 'hanzi') {
            // Check if any pronunciation or meaning overlaps
            const targetValues = from === 'zhuyin' ? targetChar.zhuyin : targetChar.english;
            const candidateValues = from === 'zhuyin' ? candidate.zhuyin : candidate.english;

            hasConflict = targetValues.some((tv: string) => candidateValues.includes(tv));
        } else if (to === 'zhuyin' || to === 'english') {
            // Check if candidate shares the same source with target
            const targetSource = from === 'hanzi' ? targetChar.hanzi :
                from === 'zhuyin' ? targetChar.zhuyin : targetChar.english;
            const candidateSource = from === 'hanzi' ? candidate.hanzi :
                from === 'zhuyin' ? candidate.zhuyin : candidate.english;

            if (from === 'hanzi') {
                hasConflict = targetSource === candidateSource;
            } else {
                hasConflict = Array.isArray(targetSource) ?
                    targetSource.some((ts: string) => candidateSource.includes(ts)) :
                    candidateSource.includes(targetSource as string);
            }
        }

        if (!hasConflict) {
            options.push(candidate);
        }
    }

    // Shuffle the final options
    return options.sort(() => Math.random() - 0.5);
};

// Compute a new characters array with updated mastery for the specified character
export const computeUpdatedCharacters = (
    characters: Character[],
    characterId: number,
    correct: boolean
): Character[] => {
    return characters.map(char => {
        if (char.id === characterId) {
            const newMastery = correct ? Math.min(5, (char.mastery ?? 0) + 1) : Math.max(0, (char.mastery ?? 0) - 1);
            return {...char, mastery: newMastery, lastSeen: Date.now()};
        }
        return char;
    });
};

// Answer a round by updating the provided game state via setter; delegates mastery update to a callback
export const answerRound = (
    selectedChar: Character,
    gameState: GameState | null,
    setGameState: (updater: (prev: GameState | null) => GameState | null) => void,
    onUpdateMastery?: (characterId: number, correct: boolean) => void
): void => {
    if (!gameState || gameState.rounds[gameState.currentRound].answered) return;

    const current = gameState.rounds[gameState.currentRound];
    const isCorrect = selectedChar.id === current.character.id;

    // Update mastery in the owning state (if provided)
    if (onUpdateMastery) onUpdateMastery(current.character.id, isCorrect);

    // Update game state
    setGameState(prev => {
        if (!prev) return null;
        const updated = {
            ...prev,
            rounds: prev.rounds.map((round, idx) =>
                idx === prev.currentRound
                    ? {...round, answered: true, correct: isCorrect}
                    : round
            ),
            score: prev.score + (isCorrect ? 1 : 0)
        };
        return updated;
    });

    // Move to next round after a brief delay
    setTimeout(() => {
        setGameState(prev => {
            if (!prev) return null;
            if (prev.currentRound < prev.rounds.length - 1) {
                return {...prev, currentRound: prev.currentRound + 1};
            }
            return prev; // Game finished
        });
    }, 1500);
};
