import React, {useEffect, useState} from 'react';
import {Play} from 'lucide-react';
import {GAME_MODES, GameMode} from "../types/GameMode";

interface HomePageProps {
    onStartGame: (gameLength: number, numOptions: number, gameMode: GameMode, round: number) => void;
}

export const HomePage = ({onStartGame}: HomePageProps): React.ReactElement => {
    const [difficulty, setDifficulty] = useState<number>(1);
    const [round, setRound] = useState<number>(0);
    const [maxRounds] = useState<{ [key: number]: number }>({});
    const [gameLength, setGameLength] = useState<number>(10);
    const [numOptions, setNumOptions] = useState<number>(4);
    const [selectedMode, setSelectedMode] = useState<GameMode>(GAME_MODES[0]);

    // Update round when difficulty changes
    useEffect(() => {
        if (maxRounds[difficulty]) {
            setRound(0);
        }
    }, [difficulty]);

    return (
        <div className="max-w-md mx-auto">
            <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                        漢字學習
                    </h1>
                    <div
                        className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-emerald-400 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-3 text-white/90">Game Mode</label>
                        <select
                            className="w-full p-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                            value={selectedMode.id}
                            onChange={(e) => {
                                const found = GAME_MODES.find(m => m.id === e.target.value);
                                if (found) setSelectedMode(found);
                            }}
                        >
                            {GAME_MODES.map(mode => (
                                <option key={mode.id} value={mode.id}
                                        className="text-gray-800">{mode.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3 text-white/90">Game
                            Length: {gameLength} rounds</label>
                        <div className="relative">
                            <input
                                type="range"
                                min="5"
                                max="20"
                                value={gameLength}
                                onChange={(e) => setGameLength(parseInt(e.target.value))}
                                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3 text-white/90">Number of
                            Options: {numOptions}</label>
                        <div className="relative">
                            <input
                                type="range"
                                min="2"
                                max="6"
                                value={numOptions}
                                onChange={(e) => setNumOptions(parseInt(e.target.value))}
                                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3 text-white/90">Difficulty
                            Level: {difficulty}</label>
                        <div className="relative">
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={difficulty}
                                onChange={(e) => setDifficulty(parseInt(e.target.value))}
                                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3 text-white/90">Round: {round} -
                            Difficulty: {Math.ceil(round / 5)}</label>
                        <div className="relative">
                            <input
                                type="range"
                                min="0"
                                max={maxRounds[difficulty] || 0}
                                value={round}
                                onChange={(e) => setRound(parseInt(e.target.value))}
                                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => onStartGame(gameLength, numOptions, selectedMode, round)}
                        className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-semibold p-5 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 border border-white/10"
                    >
                        <Play className="w-6 h-6"/>
                        Start Learning Journey
                    </button>
                </div>
            </div>
        </div>
    );
};
