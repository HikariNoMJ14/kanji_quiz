import React, {useEffect, useState} from 'react';
import {Home, Search} from 'lucide-react';
import {Character} from "./types/Character";
import {HomePage} from "./components/HomePage";
import {GamePage} from "./components/GamePage";
import {SearchPage} from "./components/SearchPage";
import {GameState} from "./types/GameState";
import {computeUpdatedCharacters, startGame} from "./utilities/utils";

// Character database - loaded from backend API (Django)
const loadCharacterData = async (): Promise<Character[]> => {
    try {
        const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL as string) || 'http://localhost:8000';
        // Query all by using empty query string
        const response = await fetch(`${BACKEND_URL}/api/search/?query=`);
        if (!response.ok) {
            throw new Error(`Backend request failed with status ${response.status}`);
        }
        const jsonData = await response.json();

        // Transform the data to match our app's expected format
        return (jsonData as any[]).map((char: any) => ({
            id: char.id,
            hanzi: char.hanzi,
            zhuyin: char.zhuyin ? [char.zhuyin] : [],
            english: Array.isArray(char.translations) ? char.translations.map((t: any) => t.translation) : [],
            mastery: 0,
            level: char.level,
            round: char.round
        }));
    } catch (error) {
        console.error('Error loading character data:', error);
        return [];
    }
};

export default function HanziLearningApp() {
    const [currentPage, setCurrentPage] = useState<'home' | 'game' | 'search'>('home');
    const [characters, setCharacters] = useState<Character[]>([]);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [loading, setLoading] = useState(true);

    // Load character data on component mount
    useEffect(() => {
        const initializeData = async () => {
            try {
                const data = await loadCharacterData();
                setCharacters(data);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, []);

    const handleStartGame = (gameLength: number, numOptions: number, gameMode: any, round: number) => {
        startGame(gameLength, numOptions, gameMode, round, characters, setGameState, setCurrentPage);
    };

    const handleUpdateMastery = (characterId: number, correct: boolean) => {
        setCharacters(prev => computeUpdatedCharacters(prev, characterId, correct));
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-green-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            {loading ? (
                <div className="max-w-md mx-auto relative z-10">
                    <div
                        className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 text-center">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-400 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-white/80 font-medium">Loading characters...</p>
                    </div>
                </div>
            ) : characters.length === 0 ? (
                <div className="max-w-md mx-auto relative z-10">
                    <div
                        className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 text-center">
                        <p className="text-red-400 font-medium">Failed to load character data</p>
                    </div>
                </div>
            ) : (
                <div className="relative z-10">
                    {/* Floating Navigation */}
                    <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
                        <div
                            className="flex space-x-2 backdrop-blur-xl bg-white/10 p-2 rounded-full shadow-2xl border border-white/20">
                            <button
                                onClick={() => setCurrentPage('home')}
                                className={`p-3 rounded-full transition-all duration-200 ${
                                    currentPage === 'home'
                                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/30'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <Home className="w-5 h-5"/>
                            </button>
                            <button
                                onClick={() => setCurrentPage('search')}
                                className={`p-3 rounded-full transition-all duration-200 ${
                                    currentPage === 'search'
                                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/30'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <Search className="w-5 h-5"/>
                            </button>
                        </div>
                    </nav>

                    {/* Page Content */}
                    <div className="pt-24">
                        {currentPage === 'home' && <HomePage onStartGame={handleStartGame}/>}
                        {currentPage === 'game' && (
                            <GamePage
                                gameState={gameState}
                                setGameState={setGameState}
                                onUpdateMastery={handleUpdateMastery}
                                setCurrentPage={setCurrentPage}
                            />
                        )}
                        {currentPage === 'search' && <SearchPage/>}
                    </div>
                </div>
            )}
        </div>
    );
}