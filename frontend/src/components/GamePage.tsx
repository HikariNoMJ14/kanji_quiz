import React from 'react';
import {Character} from "../types/Character";
import {GameState} from "../types/GameState";
import {answerRound} from "../utilities/utils";

interface GamePageProps {
    gameState: GameState | null;
    setGameState: (updater: (prev: GameState | null) => GameState | null) => void;
    onUpdateMastery: (characterId: number, correct: boolean) => void;
    setCurrentPage: (page: 'home' | 'game' | 'search') => void;
}

export const GamePage = ({gameState, setGameState, onUpdateMastery, setCurrentPage}: GamePageProps): React.ReactElement | null => {

    if (!gameState) return null;

    const {rounds, currentRound, score, gameMode} = gameState;
    const round = rounds[currentRound];
    const isGameFinished = currentRound >= rounds.length - 1 && round?.answered;

    if (isGameFinished) {
        const accuracy = Math.round((score / rounds.length) * 100);
        return (
            <div className="max-w-md mx-auto">
                <div
                    className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 text-center">
                    <div className="mb-6">
                        <div className="text-6xl mb-4">
                            {accuracy >= 90 ? '🎉' : accuracy >= 70 ? '⭐' : '💪'}
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Journey Complete!</h2>
                        <div
                            className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-emerald-400 mx-auto rounded-full"></div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20">
                            <div
                                className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                                {score}/{rounds.length}
                            </div>
                            <div className="text-2xl text-white/90 font-semibold">
                                {accuracy}% Mastery
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setCurrentPage('home')}
                        className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-semibold p-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                    >
                        Continue Learning
                    </button>
                </div>
            </div>
        );
    }

    const getPromptText = (): string => {
        const {from} = gameMode;
        const char = round.character;

        if (from === 'hanzi') return char.hanzi;
        if (from === 'zhuyin') return char.zhuyin[0];
        if (from === 'english') return char.english[0];
        return ''; // Default fallback
    };

    const getOptionText = (option: Character): string => {
        const {to} = gameMode;

        if (to === 'hanzi') return option.hanzi;
        if (to === 'zhuyin') return option.zhuyin[0];
        if (to === 'english') return option.english[0];
        return ''; // Default fallback
    };

    const progress = ((currentRound + (round.answered ? 1 : 0)) / rounds.length) * 100;
    const currentAccuracy = currentRound + (round.answered ? 1 : 0) > 0 ? (score / (currentRound + (round.answered ? 1 : 0))) * 100 : 0;

    // Dynamic progress bar color based on accuracy
    const getProgressBarColor = () => {
        if (currentAccuracy >= 80) return "from-emerald-400 to-cyan-400";
        if (currentAccuracy >= 60) return "from-blue-400 to-cyan-400";
        if (currentAccuracy >= 40) return "from-yellow-400 to-orange-400";
        return "from-red-400 to-red-500";
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20">
                <div className="text-center mb-8">
                    <div className="text-sm text-white/70 mb-3 font-medium">{gameMode.label}</div>
                    <div className="text-6xl font-bold text-white mb-6 tracking-wider">
                        {getPromptText()}
                    </div>
                    <div className="relative w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getProgressBarColor()} rounded-full transition-all duration-500 ease-out`}
                            style={{width: `${progress}%`}}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    {round.options.map((option, idx) => {
                        let buttonClass = "w-full p-5 rounded-2xl text-left transition-all duration-200 border ";

                        if (round.answered) {
                            if (option.id === round.character.id) {
                                buttonClass += "bg-emerald-500/20 border-emerald-400 text-emerald-100 shadow-lg shadow-emerald-500/20";
                            } else {
                                buttonClass += "bg-white/5 border-white/10 text-white/50";
                            }
                        } else {
                            buttonClass += "backdrop-blur-xl bg-white/10 border-white/20 hover:border-cyan-400 hover:bg-white/20 text-white hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => answerRound(option, gameState, setGameState, onUpdateMastery)}
                                disabled={round.answered}
                                className={buttonClass}
                            >
                                <div className="text-2xl font-semibold">{getOptionText(option)}</div>
                            </button>
                        );
                    })}
                </div>

                {round.answered && (
                    <div className="mt-6 text-center">
                        <div className={`text-xl font-bold ${round.correct ? 'text-emerald-300' : 'text-red-300'}`}>
                            {round.correct ? '✨ 正確! Perfect!' : '❌ 再試試 Try again!'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
