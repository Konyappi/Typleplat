import React from 'react';
import { Flame, Coins, Store, BarChart3, Volume2, VolumeX, Sparkles, Gauge, Clock } from 'lucide-react';
import { sounds } from '../utils/audio';

export default function TopBar({ 
  coins, 
  streak, 
  difficulty,
  timeLeft,
  onChangeDifficulty,
  onOpenShop, 
  onOpenStats, 
  soundEnabled, 
  setSoundEnabled 
}) {
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    sounds.enabled = !soundEnabled;
    if (!soundEnabled) sounds.playPop();
  };

  const DIFFICULTIES = [
    { id: 'easy', label: 'EASY', color: 'bg-emerald-400 text-black', badge: '🟢 1.0x' },
    { id: 'normal', label: 'NORMAL', color: 'bg-yellow-400 text-black', badge: '🟡 1.5x' },
    { id: 'hard', label: 'HARD', color: 'bg-rose-500 text-white', badge: '🔴 2.5x' }
  ];

  return (
    <header className="w-full max-w-5xl mx-auto pt-4 px-4 pb-2 z-20 relative">
      <div className="bg-white rounded-3xl md:rounded-full border-4 border-black shadow-pop p-3 md:p-4 flex flex-wrap items-center justify-between gap-3 transition-all">
        
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="bg-tycoon-yellow rounded-full p-2 border-3 border-black shadow-pop-sm flex items-center justify-center animate-bounce-slow">
            <span className="text-2xl md:text-3xl select-none">🚗</span>
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl md:text-2xl text-black tracking-wide flex items-center gap-1.5 leading-none">
              TYCOON <span className="text-tycoon-purple">PLATE TYPER</span>
              <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-400 inline-block" />
            </h1>
            <p className="text-xs font-bold text-gray-500 hidden sm:block">AI Licensing Gatekeeper Simulation</p>
          </div>
        </div>

        {/* Difficulty Selection Pills */}
        <div className="bg-gray-100 border-3 border-black rounded-full p-1 flex items-center gap-1 shadow-pop-sm">
          <span className="text-[10px] font-black text-gray-600 px-2 flex items-center gap-1 hidden lg:flex">
            <Gauge className="w-3.5 h-3.5" /> LEVEL:
          </span>
          {DIFFICULTIES.map((d) => {
            const isSelected = difficulty === d.id;
            return (
              <button
                key={d.id}
                onClick={() => {
                  if (!isSelected) {
                    sounds.playPop();
                    onChangeDifficulty(d.id);
                  }
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-black border-2 transition-all ${
                  isSelected 
                    ? `${d.color} border-black shadow-pop-sm scale-105` 
                    : 'bg-transparent border-transparent text-gray-600 hover:bg-gray-200'
                }`}
                title={`Level ${d.label} (${d.badge} Coins)`}
              >
                {d.label} <span className="text-[10px] opacity-80">{d.badge.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Currency & Streaks (Top Bar Score Bubble) */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Challenge Timer */}
          <div className={`border-3 border-black rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-pop-sm transition-colors ${timeLeft <= 3 ? 'bg-rose-500 text-white animate-pulse' : 'bg-sky-100 text-black'}`}>
            <Clock className="w-5 h-5" />
            <span className="font-display font-extrabold text-lg md:text-xl tabular-nums">
              {timeLeft}s
            </span>
          </div>

          {/* Coin Token */}
          <div className="bg-amber-100 border-3 border-black rounded-full px-3 py-1.5 flex items-center gap-2 shadow-pop-sm">
            <div className="bg-amber-400 rounded-full p-1 border-2 border-black">
              <Coins className="w-5 h-5 text-amber-950 fill-amber-300" />
            </div>
            <span className="font-display font-extrabold text-lg md:text-xl text-black">
              {coins.toLocaleString()}
            </span>
          </div>

          {/* Streak Bubble */}
          <div className={`border-3 border-black rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-pop-sm transition-transform ${streak > 0 ? 'bg-orange-100 scale-105' : 'bg-gray-100'}`}>
            <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-gray-400'}`} />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-sm md:text-base text-black leading-none">
                {streak} <span className="text-xs font-bold text-gray-600">STREAK</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Shop Button */}
          <button
            onClick={() => { sounds.playPop(); onOpenShop(); }}
            className="bg-tycoon-purple hover:bg-tycoon-purpleDark text-white font-extrabold px-3.5 py-2 rounded-full border-3 border-black shadow-pop-sm pop-btn flex items-center gap-1.5 text-sm"
            title="Buka Garasi Shop"
          >
            <Store className="w-4 h-4" />
            <span className="hidden md:inline">GARASI</span>
          </button>

          {/* Stats Button */}
          <button
            onClick={() => { sounds.playPop(); onOpenStats(); }}
            className="bg-tycoon-sky hover:bg-sky-300 text-black font-extrabold px-3 py-2 rounded-full border-3 border-black shadow-pop-sm pop-btn flex items-center gap-1"
            title="Lihat Statistik"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-full border-3 border-black shadow-pop-sm pop-btn text-black ${soundEnabled ? 'bg-emerald-400' : 'bg-gray-300'}`}
            title={soundEnabled ? "Mute Suara" : "Aktifkan Suara"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
}
