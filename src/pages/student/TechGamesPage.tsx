import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Gamepad2, Trophy, ArrowLeft, Sparkles, CheckCircle2, RotateCcw, Flame, Code, Cpu, Database, Bug, Layers } from 'lucide-react';

interface TechGamesPageProps {
  onNavigate?: (view: string) => void;
}

// GAME 1: CODE UNSCRAMBLER PUZZLE DATA
const UNSCRAMBLE_LEVELS = [
  {
    id: 'u-1',
    title: 'Python Function Assembly Puzzle',
    subject: 'Python Programming',
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
    title: 'C++ Class Definition Assembly',
    subject: 'C++ Systems',
    initialLines: [
      'public:',
      'void display() { std::cout << name; }',
      'class Student {',
      'private: std::string name;',
      '};',
    ],
    correctLines: [
      'class Student {',
      'private: std::string name;',
      'public:',
      'void display() { std::cout << name; }',
      '};',
    ],
  },
];

// GAME 2: WORD FINDER MATRIX DATA
const WORD_MATRIX = [
  ['P', 'O', 'I', 'N', 'T', 'E', 'R', 'S'],
  ['D', 'O', 'C', 'K', 'E', 'R', 'A', 'P'],
  ['P', 'R', 'O', 'M', 'I', 'S', 'E', 'O'],
  ['T', 'E', 'N', 'S', 'O', 'R', 'F', 'I'],
  ['M', 'U', 'T', 'E', 'X', 'B', 'C', 'N'],
  ['I', 'N', 'D', 'E', 'X', 'A', 'C', 'T'],
];
const TARGET_WORDS = ['POINTERS', 'DOCKER', 'PROMISE', 'TENSOR', 'MUTEX', 'INDEX'];

export const TechGamesPage: React.FC<TechGamesPageProps> = () => {
  const { user } = useAuth();
  const [activeGameMode, setActiveGameMode] = useState<'catalog' | 'unscramble' | 'word-finder'>('catalog');

  // Game 1 State
  const [levelIdx, setLevelIdx] = useState(0);
  const [currentLines, setCurrentLines] = useState<string[]>(UNSCRAMBLE_LEVELS[0].initialLines);
  const [unscrambleSuccess, setUnscrambleSuccess] = useState(false);

  // Game 2 State
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedWordInput, setSelectedWordInput] = useState('');
  const [matrixMsg, setMatrixMsg] = useState('');

  const currentLevel = UNSCRAMBLE_LEVELS[levelIdx] || UNSCRAMBLE_LEVELS[0];

  const handleStartGame = (mode: 'unscramble' | 'word-finder') => {
    if (mode === 'unscramble') {
      setLevelIdx(0);
      setCurrentLines([...UNSCRAMBLE_LEVELS[0].initialLines]);
      setUnscrambleSuccess(false);
    } else {
      setFoundWords([]);
      setSelectedWordInput('');
      setMatrixMsg('');
    }
    setActiveGameMode(mode);
  };

  const handleMoveLine = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentLines.length) return;

    const newLines = [...currentLines];
    const temp = newLines[index];
    newLines[index] = newLines[targetIndex];
    newLines[targetIndex] = temp;
    setCurrentLines(newLines);

    // Check correctness
    const isCorrect = newLines.every((line, idx) => line === currentLevel.correctLines[idx]);
    if (isCorrect) {
      setUnscrambleSuccess(true);
      if (user) {
        api.updateUserProfile(user.id, { xpPoints: (user.xpPoints || 3400) + 250 });
      }
    }
  };

  const handleNextUnscrambleLevel = () => {
    const nextIdx = (levelIdx + 1) % UNSCRAMBLE_LEVELS.length;
    setLevelIdx(nextIdx);
    setCurrentLines([...UNSCRAMBLE_LEVELS[nextIdx].initialLines]);
    setUnscrambleSuccess(false);
  };

  const handleWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wordUpper = selectedWordInput.trim().toUpperCase();
    if (!wordUpper) return;

    if (TARGET_WORDS.includes(wordUpper)) {
      if (foundWords.includes(wordUpper)) {
        setMatrixMsg(`Word "${wordUpper}" already discovered!`);
      } else {
        const nextFound = [...foundWords, wordUpper];
        setFoundWords(nextFound);
        setMatrixMsg(`🎉 Great job! Found word: ${wordUpper} (+300 XP)`);
        if (user) {
          api.updateUserProfile(user.id, { xpPoints: (user.xpPoints || 3400) + 300 });
        }
      }
    } else {
      setMatrixMsg(`"${wordUpper}" is not in the hidden tech matrix.`);
    }
    setSelectedWordInput('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="badge-purple px-3 py-1 rounded-full text-xs font-black">
              INTERACTIVE CODING ARCADE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight force-white flex items-center space-x-3">
            <Gamepad2 className="w-9 h-9 text-amber-400" />
            <span>Non-MCQ Interactive Tech Games</span>
          </h1>
          <p className="text-xs force-purple-sub font-bold max-w-xl">
            Solve non-MCQ code assembly puzzles and search tech matrix terms to earn XP points and boost your rank on the global academic leaderboard.
          </p>
        </div>
      </div>

      {activeGameMode !== 'catalog' && (
        <button
          onClick={() => setActiveGameMode('catalog')}
          className="px-4 py-2.5 rounded-2xl badge-purple text-xs font-black flex items-center space-x-2 shadow"
        >
          <ArrowLeft className="w-4 h-4 text-purple-900" />
          <span>Back to Games Catalog</span>
        </button>
      )}

      {/* CATALOG VIEW */}
      {activeGameMode === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Game Card 1 */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-purple-300/30 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl badge-purple flex items-center justify-center">
                  <Code className="w-6 h-6 text-purple-900" />
                </div>
                <span className="badge-yellow px-3 py-1 rounded-xl text-xs font-black">+250 XP</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 profile-name-text">
                Code Line Unscrambler Puzzle
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
                Re-order scrambled executable code blocks into correct logic sequence.
              </p>
            </div>
            <button
              onClick={() => handleStartGame('unscramble')}
              className="w-full btn-yellow-pastel py-3 rounded-2xl text-xs font-black shadow"
            >
              Play Code Unscrambler
            </button>
          </div>

          {/* Game Card 2 */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-purple-300/30 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl badge-sage flex items-center justify-center">
                  <Flame className="w-6 h-6 text-emerald-900" />
                </div>
                <span className="badge-yellow px-3 py-1 rounded-xl text-xs font-black">+300 XP</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 profile-name-text">
                Tech Term Word Finder Matrix
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
                Search and identify technical keywords hidden inside an interactive letter matrix.
              </p>
            </div>
            <button
              onClick={() => handleStartGame('word-finder')}
              className="w-full btn-yellow-pastel py-3 rounded-2xl text-xs font-black shadow"
            >
              Play Word Finder Matrix
            </button>
          </div>
        </div>
      )}

      {/* GAME 1: CODE UNSCRAMBLER */}
      {activeGameMode === 'unscramble' && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-purple-300/30 shadow-2xl">
          <div className="flex items-center justify-between border-b border-purple-300/20 pb-4">
            <div>
              <span className="badge-purple px-3 py-1 rounded-xl text-xs font-black">{currentLevel.subject}</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 profile-name-text mt-1">
                {currentLevel.title}
              </h2>
            </div>
            <span className="badge-yellow px-3 py-1 rounded-xl text-xs font-black">Level {levelIdx + 1}</span>
          </div>

          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Use the ▲ and ▼ arrows to move code lines into the correct executable sequence.
          </p>

          <div className="space-y-3">
            {currentLines.map((line, idx) => (
              <div
                key={idx}
                className="p-4 glass-card-sub rounded-2xl border border-purple-300/30 flex items-center justify-between font-mono text-xs font-bold text-purple-950 dark:text-purple-100"
              >
                <span>{line}</span>
                <div className="flex items-center space-x-2">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveLine(idx, 'up')}
                    className="px-2.5 py-1 rounded-xl badge-purple disabled:opacity-30 text-xs font-black"
                  >
                    ▲ Up
                  </button>
                  <button
                    disabled={idx === currentLines.length - 1}
                    onClick={() => handleMoveLine(idx, 'down')}
                    className="px-2.5 py-1 rounded-xl badge-purple disabled:opacity-30 text-xs font-black"
                  >
                    ▼ Down
                  </button>
                </div>
              </div>
            ))}
          </div>

          {unscrambleSuccess && (
            <div className="p-4 rounded-2xl badge-sage border border-emerald-400 text-xs font-black flex items-center justify-between animate-fadeIn">
              <span className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>🎉 Perfect Assembly! You earned +250 XP!</span>
              </span>
              <button
                onClick={handleNextUnscrambleLevel}
                className="btn-yellow-pastel px-4 py-2 rounded-xl text-xs font-black shadow"
              >
                Next Puzzle Level
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: WORD FINDER MATRIX */}
      {activeGameMode === 'word-finder' && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-purple-300/30 shadow-2xl">
          <div className="flex items-center justify-between border-b border-purple-300/20 pb-4">
            <div>
              <span className="badge-sage px-3 py-1 rounded-xl text-xs font-black">WORD MATRIX</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 profile-name-text mt-1">
                Tech Keyword Matrix Search
              </h2>
            </div>
            <span className="badge-yellow px-3 py-1 rounded-xl text-xs font-black">
              Found: {foundWords.length}/{TARGET_WORDS.length}
            </span>
          </div>

          <div className="p-4 glass-card-sub rounded-2xl overflow-x-auto text-center">
            <div className="inline-block space-y-2 font-mono text-base font-black">
              {WORD_MATRIX.map((row, rIdx) => (
                <div key={rIdx} className="flex space-x-3 justify-center">
                  {row.map((char, cIdx) => (
                    <span
                      key={cIdx}
                      className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-purple-950 dark:text-purple-100 border border-purple-300/40 shadow-sm"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleWordSubmit} className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Type discovered word (e.g. POINTERS, DOCKER)..."
              value={selectedWordInput}
              onChange={(e) => setSelectedWordInput(e.target.value)}
              className="flex-1 px-4 py-3 glass-card-sub rounded-2xl text-xs text-slate-900 dark:text-slate-100 font-black focus:outline-none border border-purple-300/40 uppercase tracking-widest"
            />
            <button type="submit" className="btn-yellow-pastel px-6 py-3 rounded-2xl text-xs font-black shadow">
              Submit Word
            </button>
          </form>

          {matrixMsg && (
            <p className="p-3 rounded-xl badge-purple text-xs font-black text-purple-950 dark:text-purple-100">
              {matrixMsg}
            </p>
          )}

          {/* Discovered Words Tags */}
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-700 dark:text-slate-300">Target Tech Words:</span>
            <div className="flex flex-wrap gap-2">
              {TARGET_WORDS.map((w) => (
                <span
                  key={w}
                  className={`px-3 py-1 rounded-xl text-xs font-black ${
                    foundWords.includes(w) ? 'badge-sage' : 'glass-card-sub text-slate-400'
                  }`}
                >
                  {w} {foundWords.includes(w) ? '✓' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
