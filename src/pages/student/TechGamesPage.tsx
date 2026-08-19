import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { TechGame } from '../../types';
import { Gamepad2, Trophy, ArrowLeft, Sparkles, CheckCircle2, RotateCcw, Flame } from 'lucide-react';

interface TechGamesPageProps {
  onNavigate?: (view: string) => void;
}

// GAME MODE 1: CODE UNSCRAMBLER PUZZLE DATA
const UNSCRAMBLE_LEVELS = [
  {
    id: 'u-1',
    title: 'Python Function Assembly Puzzle',
    subject: 'Python',
    initialLines: [
      'return total',
      'def calculate_sum(numbers):',
      'total = sum(numbers)',
      'print("Calculation Complete")',
    ],
    correctLines: [
      'def calculate_sum(numbers):',
      'total = sum(numbers)',
      'print("Calculation Complete")',
      'return total',
    ],
  },
  {
    id: 'u-2',
    title: 'C Pointer Swap Mechanics',
    subject: 'C Language',
    initialLines: [
      '*a = *b;',
      '*b = temp;',
      'int temp = *a;',
      'void swap(int *a, int *b) {',
      '}',
    ],
    correctLines: [
      'void swap(int *a, int *b) {',
      'int temp = *a;',
      '*a = *b;',
      '*b = temp;',
      '}',
    ],
  },
  {
    id: 'u-3',
    title: 'SQL Multi-Table JOIN Query',
    subject: 'SQL Databases',
    initialLines: [
      'HAVING COUNT(o.id) > 5;',
      'LEFT JOIN orders o ON u.id = o.user_id',
      'SELECT u.name, COUNT(o.id)',
      'GROUP BY u.name',
      'FROM users u',
    ],
    correctLines: [
      'SELECT u.name, COUNT(o.id)',
      'FROM users u',
      'LEFT JOIN orders o ON u.id = o.user_id',
      'GROUP BY u.name',
      'HAVING COUNT(o.id) > 5;',
    ],
  },
];

// GAME MODE 2: TECH WORD FINDER MATRIX DATA
const WORD_MATRIX = [
  ['P', 'O', 'I', 'N', 'T', 'E', 'R', 'S'],
  ['D', 'O', 'C', 'K', 'E', 'R', 'A', 'Y'],
  ['P', 'R', 'O', 'M', 'I', 'S', 'E', 'S'],
  ['T', 'E', 'N', 'S', 'O', 'R', 'L', 'L'],
  ['M', 'U', 'T', 'E', 'X', 'B', 'O', 'X'],
  ['I', 'N', 'D', 'E', 'X', 'A', 'C', 'I'],
];
const TARGET_WORDS = ['POINTER', 'DOCKER', 'PROMISE', 'TENSOR', 'MUTEX', 'INDEX'];

export const TechGamesPage: React.FC<TechGamesPageProps> = () => {
  const { user } = useAuth();
  const [games, setGames] = useState<TechGame[]>([]);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'catalog' | 'unscramble' | 'word-finder'>('catalog');

  // Game 1 State (Code Unscrambler)
  const [levelIdx, setLevelIdx] = useState(0);
  const [currentLines, setCurrentLines] = useState<string[]>([]);
  const [unscrambleSuccess, setUnscrambleSuccess] = useState(false);

  // Game 2 State (Word Finder)
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<{ r: number; c: number }[]>([]);

  // User XP
  const [sessionXP, setSessionXP] = useState(0);
  const [audioOn, setAudioOn] = useState(true);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    const list = await api.getGames();
    setGames(list);
  };

  const startUnscrambleGame = (level = 0) => {
    setLevelIdx(level);
    setCurrentLines([...UNSCRAMBLE_LEVELS[level].initialLines]);
    setUnscrambleSuccess(false);
    setActiveMode('unscramble');
  };

  const moveLine = (fromIdx: number, toIdx: number) => {
    const updated = [...currentLines];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setCurrentLines(updated);

    // Check if correct
    const target = UNSCRAMBLE_LEVELS[levelIdx].correctLines;
    if (JSON.stringify(updated) === JSON.stringify(target)) {
      setUnscrambleSuccess(true);
      awardXP(250);
    }
  };

  const startWordFinderGame = () => {
    setFoundWords([]);
    setSelectedCells([]);
    setActiveMode('word-finder');
  };

  const handleCellClick = (r: number, c: number) => {
    const exists = selectedCells.some((cell) => cell.r === r && cell.c === c);
    let updated: { r: number; c: number }[];

    if (exists) {
      updated = selectedCells.filter((cell) => !(cell.r === r && cell.c === c));
    } else {
      updated = [...selectedCells, { r, c }];
    }

    setSelectedCells(updated);

    // Check if formed word matches target
    const formedWord = updated.map((cell) => WORD_MATRIX[cell.r][cell.c]).join('');
    if (TARGET_WORDS.includes(formedWord) && !foundWords.includes(formedWord)) {
      const newFound = [...foundWords, formedWord];
      setFoundWords(newFound);
      setSelectedCells([]);
      awardXP(300);
    }
  };

  const awardXP = async (points: number) => {
    setSessionXP((prev) => prev + points);
    if (user) {
      const currentXP = user.xpPoints || 1400;
      await api.updateUserProfile(user.id, { xpPoints: currentXP + points });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Gamepad2 className="w-7 h-7 text-amber-500" />
            <span>Interactive Games Arcade</span>
          </h1>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Play interactive code puzzles, tech word finder matrix games, and boost your Global Leaderboard XP!
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="badge-yellow px-4 py-2 rounded-2xl text-xs font-black flex items-center space-x-1.5 shadow">
            <Trophy className="w-4 h-4 text-amber-800" />
            <span>Earned Arcade XP: +{sessionXP}</span>
          </div>

          <button
            onClick={() => setAudioOn(!audioOn)}
            className="p-2.5 rounded-xl badge-purple hover:bg-purple-200 transition text-xs font-bold flex items-center space-x-1"
          >
            {audioOn ? <Volume2 className="w-4 h-4 text-purple-900" /> : <VolumeX className="w-4 h-4 text-purple-900" />}
            <span className="hidden sm:inline">{audioOn ? 'Audio ON' : 'Audio OFF'}</span>
          </button>
        </div>
      </div>

      {/* MODE 1: CATALOG VIEW */}
      {activeMode === 'catalog' && (
        <div className="space-y-6">
          {/* Featured Game Modes Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Game Card 1: Code Unscrambler */}
            <div className="glass-card rounded-3xl p-6 space-y-4 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="badge-yellow px-3 py-1 rounded-full text-[10px] font-black">INTERACTIVE PUZZLE</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">🧩 Code Syntax Line Unscrambler</h3>
                <p className="text-xs text-purple-100 font-bold mt-1">
                  Drag and re-order scrambled lines of code into executable syntax order!
                </p>
              </div>
              <button
                onClick={() => startUnscrambleGame(0)}
                className="btn-yellow-pastel px-6 py-2.5 rounded-xl text-xs font-black inline-flex items-center space-x-2 shadow-lg"
              >
                <span>Play Code Unscrambler (+250 XP)</span>
              </button>
            </div>

            {/* Game Card 2: Tech Word Finder */}
            <div className="glass-card rounded-3xl p-6 space-y-4 bg-gradient-to-br from-emerald-900 via-teal-800 to-indigo-900 text-white relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="badge-sage px-3 py-1 rounded-full text-[10px] font-black">WORD MATRIX</span>
                <Trophy className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">🔍 Tech Term Word Finder Matrix</h3>
                <p className="text-xs text-teal-100 font-bold mt-1">
                  Search and click tech terms hidden inside an interactive letter matrix!
                </p>
              </div>
              <button
                onClick={startWordFinderGame}
                className="btn-sage-pastel px-6 py-2.5 rounded-xl text-xs font-black inline-flex items-center space-x-2 shadow-lg"
              >
                <span>Play Word Finder Matrix (+300 XP)</span>
              </button>
            </div>
          </div>

          {/* Arcade Catalog Grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">All 10 IT Subject Arcade Challenges</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {games.map((g) => (
                <div
                  key={g.id}
                  className="glass-card p-5 rounded-2xl space-y-3 border border-purple-300/30 hover:border-amber-400 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="badge-purple px-2.5 py-0.5 rounded text-[10px] font-black">{g.subjectName}</span>
                    <span className="badge-yellow px-2 py-0.5 rounded text-[10px] font-black">{g.difficulty}</span>
                  </div>

                  <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm">{g.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 font-bold">{g.description}</p>

                  <button
                    onClick={() => startUnscrambleGame(0)}
                    className="w-full btn-yellow-pastel py-2 rounded-xl text-xs font-black inline-flex items-center justify-center space-x-1"
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>Play Arcade Challenge</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: CODE UNSCRAMBLER GAME ARENA */}
      {activeMode === 'unscramble' && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-purple-300/20 pb-4">
            <button
              onClick={() => setActiveMode('catalog')}
              className="flex items-center space-x-1 text-xs font-black text-slate-800 dark:text-slate-200 hover:text-amber-500"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Arcade Catalog</span>
            </button>

            <span className="badge-purple px-3 py-1 rounded-full text-xs font-black">
              Level {levelIdx + 1} of {UNSCRAMBLE_LEVELS.length}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              {UNSCRAMBLE_LEVELS[levelIdx].title}
            </h2>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Click the up/down arrows on the right to unscramble code lines into executable order.
            </p>
          </div>

          {unscrambleSuccess && (
            <div className="p-4 rounded-2xl badge-sage text-xs font-black flex items-center justify-between animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>Puzzle Solved! +250 XP Awarded to your profile!</span>
              </div>

              {levelIdx < UNSCRAMBLE_LEVELS.length - 1 && (
                <button
                  onClick={() => startUnscrambleGame(levelIdx + 1)}
                  className="btn-sage-pastel px-4 py-1.5 rounded-xl text-xs font-black"
                >
                  Next Level
                </button>
              )}
            </div>
          )}

          {/* Lines Re-orderable List */}
          <div className="space-y-2">
            {currentLines.map((line, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs flex items-center justify-between shadow"
              >
                <span>{line}</span>
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveLine(idx, idx - 1)}
                    className="px-2 py-1 bg-purple-900 text-white rounded text-[10px] font-black disabled:opacity-30"
                  >
                    ▲ Up
                  </button>
                  <button
                    disabled={idx === currentLines.length - 1}
                    onClick={() => moveLine(idx, idx + 1)}
                    className="px-2 py-1 bg-purple-900 text-white rounded text-[10px] font-black disabled:opacity-30"
                  >
                    ▼ Down
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 3: TECH WORD FINDER MATRIX GAME */}
      {activeMode === 'word-finder' && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-purple-300/20 pb-4">
            <button
              onClick={() => setActiveMode('catalog')}
              className="flex items-center space-x-1 text-xs font-black text-slate-800 dark:text-slate-200 hover:text-amber-500"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Arcade Catalog</span>
            </button>

            <span className="badge-sage px-3 py-1 rounded-full text-xs font-black">
              Found: {foundWords.length} / {TARGET_WORDS.length} Words
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              🔍 Tech Term Word Search Matrix
            </h2>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Click letters in sequence to spell target tech terms (`POINTER`, `DOCKER`, `PROMISE`, `TENSOR`, `MUTEX`, `INDEX`)!
            </p>
          </div>

          {/* Targets List */}
          <div className="flex flex-wrap gap-2">
            {TARGET_WORDS.map((w) => {
              const isFound = foundWords.includes(w);
              return (
                <span
                  key={w}
                  className={`px-3 py-1 rounded-xl text-xs font-black ${
                    isFound ? 'badge-sage' : 'glass-card-sub text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {w} {isFound && '✓'}
                </span>
              );
            })}
          </div>

          {/* Letter Matrix Grid */}
          <div className="grid grid-cols-8 gap-2 max-w-md mx-auto p-4 rounded-3xl bg-purple-950/20 border border-purple-300/30">
            {WORD_MATRIX.map((row, r) =>
              row.map((char, c) => {
                const isSelected = selectedCells.some((cell) => cell.r === r && cell.c === c);
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`w-10 h-10 rounded-xl font-mono text-sm font-black transition flex items-center justify-center ${
                      isSelected
                        ? 'bg-amber-400 text-purple-950 scale-110 shadow-lg'
                        : 'bg-purple-900/60 text-white hover:bg-purple-700'
                    }`}
                  >
                    {char}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
