import React, { useState, useEffect } from 'react';
import { Search, Play, Home, Star, RotateCcw } from 'lucide-react';

// TypeScript interfaces
interface CharacterJson {
  hanzi: string;
  translations: string[];
  zhuyin: string;
  pinyin1: string;
  pinyin2: string;
  topic: string;
  level: number;
  pos: string;
}

interface Character {
  id: number;
  hanzi: string;
  zhuyin: string[];
  english: string[];
  mastery: number;
  lastSeen?: number;
  level?: number;
}

interface GameMode {
  id: string;
  label: string;
  from: string;
  to: string;
}

interface GameRound {
  character: Character;
  options: Character[];
  answered: boolean;
  correct: boolean;
}

interface GameState {
  rounds: GameRound[];
  currentRound: number;
  score: number;
  gameMode: GameMode;
  gameLength: number;
  numOptions: number;
  difficulty: number;
}

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
      level: char.level
    }));
  } catch (error) {
    console.error('Error loading character data:', error);
    return [];
  }
};

const GAME_MODES: GameMode[] = [
  { id: 'hanzi-to-zhuyin', label: 'Hanzi → Zhuyin', from: 'hanzi', to: 'zhuyin' },
  { id: 'hanzi-to-english', label: 'Hanzi → English', from: 'hanzi', to: 'english' },
  { id: 'zhuyin-to-hanzi', label: 'Zhuyin → Hanzi', from: 'zhuyin', to: 'hanzi' },
  { id: 'zhuyin-to-english', label: 'Zhuyin → English', from: 'zhuyin', to: 'english' },
  { id: 'english-to-hanzi', label: 'English → Hanzi', from: 'english', to: 'hanzi' },
  { id: 'english-to-zhuyin', label: 'English → Zhuyin', from: 'english', to: 'zhuyin' }
];

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
      } catch (error) {
        console.error('Failed to load character data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Game logic functions
  const updateMastery = (characterId: number, correct: boolean) => {
    setCharacters(prev => prev.map(char => {
      if (char.id === characterId) {
        let newMastery = char.mastery;
        if (correct) {
          newMastery = Math.min(5, char.mastery + 1);
        } else {
          newMastery = Math.max(0, char.mastery - 1);
        }
        return { ...char, mastery: newMastery, lastSeen: Date.now() };
      }
      return char;
    }));
  };

  const selectCharactersForGame = (gameLength: number, difficultyLevel: number = 1): Character[] => {
    // Filter characters that match the selected difficulty level
    const filteredByDifficulty = characters.filter(char => 
      char.level === difficultyLevel
    );
    
    // If we don't have enough characters at the exact difficulty level,
    // include characters from adjacent difficulty levels
    let availableChars = [...filteredByDifficulty];
    let currentDiff = difficultyLevel;
    let offset = 1;
    
    while (availableChars.length < gameLength && (currentDiff - offset >= 1 || currentDiff + offset <= 5)) {
      // Try higher difficulty
      if (currentDiff + offset <= 5) {
        const higherDiffChars = characters.filter(char => char.level === currentDiff + offset);
        availableChars = [...availableChars, ...higherDiffChars];
      }
      
      // Try lower difficulty
      if (currentDiff - offset >= 1 && availableChars.length < gameLength) {
        const lowerDiffChars = characters.filter(char => char.level === currentDiff - offset);
        availableChars = [...availableChars, ...lowerDiffChars];
      }
      
      offset++;
    }
    
    // Prioritize characters with lower mastery
    const sorted = availableChars.sort((a, b) => {
      const aMastery = a.mastery || 0;
      const bMastery = b.mastery || 0;
      if (aMastery !== bMastery) return aMastery - bMastery;
      // Secondary sort by least recently seen
      const aLastSeen = a.lastSeen || 0;
      const bLastSeen = b.lastSeen || 0;
      return aLastSeen - bLastSeen;
    });

    return sorted.slice(0, gameLength);
  };

  const generateOptions = (targetChar: Character, gameMode: GameMode, numOptions: number): Character[] => {
    const { from, to } = gameMode;
    const options = [targetChar];

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
            candidateSource.includes(targetSource);
        }
      }

      if (!hasConflict) {
        options.push(candidate);
      }
    }

    // Shuffle the final options
    return options.sort(() => Math.random() - 0.5);
  };

  const startGame = (gameLength: number, numOptions: number, gameMode: GameMode, difficulty: number) => {
    const selectedChars = selectCharactersForGame(gameLength, difficulty);
    const rounds = selectedChars.map(char => ({
      character: char,
      options: generateOptions(char, gameMode, numOptions),
      answered: false,
      correct: false
    }));

    setGameState({
      rounds,
      currentRound: 0,
      score: 0,
      gameMode,
      gameLength,
      numOptions,
      difficulty
    });
    setCurrentPage('game');
  };

  const answerRound = (selectedChar: Character) => {
    if (!gameState || gameState.rounds[gameState.currentRound].answered) return;

    const currentRound = gameState.rounds[gameState.currentRound];
    const isCorrect = selectedChar.id === currentRound.character.id;

    // Update mastery
    updateMastery(currentRound.character.id, isCorrect);

    // Update game state
    setGameState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        rounds: prev.rounds.map((round, idx) =>
          idx === prev.currentRound
            ? { ...round, answered: true, correct: isCorrect }
            : round
        ),
        score: prev.score + (isCorrect ? 1 : 0)
      };
    });

    // Move to next round after a brief delay
    setTimeout(() => {
      setGameState(prev => {
        if (!prev) return null;
        if (prev.currentRound < prev.rounds.length - 1) {
          return { ...prev, currentRound: prev.currentRound + 1 };
        } else {
          // Game finished
          return prev;
        }
      });
    }, 1500);
  };

  const renderStars = (mastery: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= mastery 
                ? 'fill-emerald-400 text-emerald-400' 
                : 'text-white/30'
            }`}
          />
        ))}
      </div>
    );
  };

  // Home Page Component
  const HomePage = (): React.ReactElement => {
    const [gameLength, setGameLength] = useState<number>(10);
    const [numOptions, setNumOptions] = useState<number>(4);
    const [difficulty, setDifficulty] = useState<number>(1);
    const [selectedMode, setSelectedMode] = useState<GameMode>(GAME_MODES[0]);

    return (
      <div className="max-w-md mx-auto">
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              漢字學習
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-emerald-400 mx-auto rounded-full"></div>
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
                  <option key={mode.id} value={mode.id} className="text-gray-800">{mode.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-white/90">Game Length: {gameLength} rounds</label>
              <div className="relative">
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={gameLength}
                  onChange={(e) => setGameLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <style>{`
                  .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, #06b6d4, #10b981);
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
                  }
                  .slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, #06b6d4, #10b981);
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
                  }
                `}</style>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-white/90">Number of Options: {numOptions}</label>
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
              <label className="block text-sm font-medium mb-3 text-white/90">Difficulty Level: {difficulty}</label>
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

            <button
              onClick={() => startGame(gameLength, numOptions, selectedMode, difficulty)}
              className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-semibold p-5 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 border border-white/10"
            >
              <Play className="w-6 h-6" />
              Start Learning Journey
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Game Page Component
  const GamePage = (): React.ReactElement | null => {
    if (!gameState) return null;

    const { rounds, currentRound, score, gameMode } = gameState;
    const round = rounds[currentRound];
    const isGameFinished = currentRound >= rounds.length - 1 && round?.answered;

    if (isGameFinished) {
      const accuracy = Math.round((score / rounds.length) * 100);
      return (
        <div className="max-w-md mx-auto">
          <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">
                {accuracy >= 90 ? '🎉' : accuracy >= 70 ? '⭐' : '💪'}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Journey Complete!</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-emerald-400 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20">
                <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
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
      const { from } = gameMode;
      const char = round.character;

      if (from === 'hanzi') return char.hanzi;
      if (from === 'zhuyin') return char.zhuyin[0];
      if (from === 'english') return char.english[0];
      return ''; // Default fallback
    };

    const getOptionText = (option: Character): string => {
      const { to } = gameMode;

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
                style={{ width: `${progress}%` }}
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
                  onClick={() => answerRound(option)}
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

  // Search Page Component
  const SearchPage = (): React.ReactElement => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Character[]>([]);
    const [selectedChar, setSelectedChar] = useState<Character | null>(null);

    const handleSearch = (term: string) => {
      if (!term.trim()) {
        setSearchResults([]);
        return;
      }

      const results = characters.filter(char => {
        return (
          char.hanzi.includes(term) ||
          char.zhuyin.some((z: string) => z.includes(term)) ||
          char.english.some((e: string) => e.toLowerCase().includes(term.toLowerCase()))
        );
      });

      setSearchResults(results);
    };

    useEffect(() => {
      handleSearch(searchTerm);
    }, [searchTerm]);

    return (
      <div className="max-w-md mx-auto">
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              Discover Characters
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-emerald-400 mx-auto rounded-full"></div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by Hanzi, Zhuyin, or English..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>

          {searchResults.length > 0 && !selectedChar && (
            <div className="space-y-3 mb-6">
              {searchResults.map(char => (
                <button
                  key={char.id}
                  onClick={() => setSelectedChar(char)}
                  className="w-full p-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl text-left hover:border-cyan-400 hover:bg-white/20 transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">{char.hanzi}</span>
                    <span className="text-sm text-white/70">{char.english[0]}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedChar && (
            <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-5xl font-bold text-white">{selectedChar.hanzi}</h3>
                <button
                  onClick={() => setSelectedChar(null)}
                  className="text-white/60 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="backdrop-blur-xl bg-white/5 p-4 rounded-xl border border-white/10">
                  <span className="font-semibold text-cyan-300">Zhuyin: </span>
                  <span className="text-lg text-white">{selectedChar.zhuyin.join(', ')}</span>
                </div>

                <div className="backdrop-blur-xl bg-white/5 p-4 rounded-xl border border-white/10">
                  <span className="font-semibold text-emerald-300">English: </span>
                  <span className="text-white">{selectedChar.english.join(', ')}</span>
                </div>

                <div className="backdrop-blur-xl bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white/90">Mastery: </span>
                    {renderStars(selectedChar.mastery)}
                    <span className="text-sm text-white/70">
                      ({selectedChar.mastery}/5)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-green-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {loading ? (
        <div className="max-w-md mx-auto relative z-10">
          <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-400 border-t-transparent mx-auto mb-4"></div>
            <p className="text-white/80 font-medium">Loading characters...</p>
          </div>
        </div>
      ) : characters.length === 0 ? (
        <div className="max-w-md mx-auto relative z-10">
          <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 text-center">
            <p className="text-red-400 font-medium">Failed to load character data</p>
          </div>
        </div>
      ) : (
        <div className="relative z-10">
          {/* Floating Navigation */}
          <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
            <div className="flex space-x-2 backdrop-blur-xl bg-white/10 p-2 rounded-full shadow-2xl border border-white/20">
              <button
                onClick={() => setCurrentPage('home')}
                className={`p-3 rounded-full transition-all duration-200 ${
                  currentPage === 'home' 
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/30' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Home className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage('search')}
                className={`p-3 rounded-full transition-all duration-200 ${
                  currentPage === 'search' 
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/30' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </nav>

          {/* Page Content */}
          <div className="pt-24">
            {currentPage === 'home' && <HomePage />}
            {currentPage === 'game' && <GamePage />}
            {currentPage === 'search' && <SearchPage />}
          </div>
        </div>
      )}
    </div>
  );
}