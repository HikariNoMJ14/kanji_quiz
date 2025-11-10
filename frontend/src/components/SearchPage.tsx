import {Star} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {Character} from "../types/Character";

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


export const SearchPage = (): React.ReactElement => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Character[]>([]);
    const [selectedChar, setSelectedChar] = useState<Character | null>(null);
    const [characters, setCharacters] = useState<Character[]>([]);


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
                    <div
                        className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-emerald-400 mx-auto rounded-full"></div>
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

                            <div className="backdrop-blur-xl bg-white/5 p-4 rounded-xl border border-white/10">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-white/90">Round: </span>
                                    <span className="text-sm text-white/70">{selectedChar.round}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

