import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Bot, CarFront, Check, Clock3, Coins, Play, ShieldCheck, Sparkles } from 'lucide-react';
import GameDashboard from './components/GameDashboard';

const DIFFICULTIES = [
  { id: 'easy', label: 'EASY', time: '20 seconds', reward: '1.0x', color: 'bg-emerald-400', description: 'Clear plates and a relaxed pace.' },
  { id: 'normal', label: 'NORMAL', time: '15 seconds', reward: '1.5x', color: 'bg-yellow-400', description: 'A balanced test for sharp eyes.' },
  { id: 'hard', label: 'HARD', time: '10 seconds', reward: '2.5x', color: 'bg-rose-500 text-white', description: 'Heavy mud, tricky plates, big rewards.' }
];

function WelcomeDashboard({ onPlay }) {
  return (
    <main className="min-h-screen bg-tycoon-yellow bg-stripes px-4 py-8 md:py-12 flex items-center justify-center">
      <section className="w-full max-w-5xl bg-white border-4 border-black shadow-pop-xl rounded-[2rem] overflow-hidden">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-7 md:p-12 bg-tycoon-purple text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 text-[10rem] opacity-15 rotate-12 select-none">🚗</div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-yellow-300 text-black border-3 border-black rounded-full px-3 py-1 text-xs font-black shadow-pop-sm">
                <Sparkles className="w-4 h-4" /> AI-POWERED SIMULATION
              </div>
              <h1 className="mt-7 max-w-xl font-display font-black text-5xl md:text-7xl leading-[0.9] tracking-tight">
                TYCOON<br /><span className="text-yellow-300">PLATE TYPER</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg md:text-xl font-bold leading-relaxed text-white/90">
                Become the gatekeeper. Read messy license plates, verify every vehicle, and build your inspection empire one sharp answer at a time.
              </p>
              <button
                type="button"
                onClick={onPlay}
                className="mt-8 bg-yellow-300 hover:bg-yellow-200 text-black font-display font-black text-2xl px-8 py-4 rounded-2xl border-4 border-black shadow-pop-lg pop-btn inline-flex items-center gap-3"
              >
                <Play className="w-7 h-7 fill-black" /> PLAY NOW <ArrowRight className="w-7 h-7" />
              </button>
            </div>
          </div>

          <div className="p-7 md:p-10 bg-sky-100 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="bg-white border-3 border-black rounded-2xl p-3 shadow-pop-sm">
                <Bot className="w-8 h-8 text-tycoon-purple" />
              </div>
              <div>
                <p className="font-black text-sm text-gray-500 uppercase tracking-widest">Your mission</p>
                <h2 className="font-display font-black text-2xl text-black">Run the smartest checkpoint</h2>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              {[
                [CarFront, 'Inspect every vehicle', 'Spot the hidden plate through the dirt.'],
                [ShieldCheck, 'Verify with AI', 'Type the plate before the timer runs out.'],
                [Coins, 'Earn and upgrade', 'Build your streak and unlock your garage.']
              ].map(([Icon, title, description]) => (
                <div key={title} className="flex gap-3 items-start">
                  <Icon className="w-6 h-6 mt-0.5 shrink-0 text-tycoon-purple" />
                  <div><h3 className="font-black text-black">{title}</h3><p className="font-medium text-gray-600 text-sm">{description}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-5 border-t-2 border-black/15 flex items-center gap-2 text-sm font-black text-gray-600">
              <Clock3 className="w-4 h-4" /> Choose your pace after pressing play
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function DifficultyScreen({ selectedDifficulty, onSelect, onBack, onStart }) {
  return (
    <main className="min-h-screen bg-tycoon-yellow bg-stripes px-4 py-8 md:py-12 flex items-center justify-center">
      <section className="w-full max-w-4xl">
        <button type="button" onClick={onBack} className="mb-5 inline-flex items-center gap-2 font-black text-black hover:underline">
          <ArrowLeft className="w-5 h-5" /> BACK TO BRIEFING
        </button>
        <div className="bg-white border-4 border-black rounded-[2rem] shadow-pop-xl p-6 md:p-10">
          <div className="text-center">
            <p className="font-black text-sm text-tycoon-purple uppercase tracking-[0.2em]">Checkpoint briefing</p>
            <h1 className="mt-2 font-display font-black text-4xl md:text-6xl text-black">Choose your difficulty</h1>
            <p className="mt-3 font-bold text-gray-600">How much pressure can your inspection desk handle?</p>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {DIFFICULTIES.map((difficulty) => {
              const isSelected = selectedDifficulty === difficulty.id;
              return (
                <button
                  key={difficulty.id}
                  type="button"
                  onClick={() => onSelect(difficulty.id)}
                  className={`text-left p-5 rounded-2xl border-4 border-black transition-all ${isSelected ? `${difficulty.color} shadow-pop-lg -translate-y-1` : 'bg-gray-50 hover:bg-gray-100 shadow-pop-sm'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-2xl">{difficulty.label}</span>
                    {isSelected && <Check className="w-6 h-6" />}
                  </div>
                  <div className="mt-5 flex items-center gap-2 font-black"><Clock3 className="w-5 h-5" /> {difficulty.time}</div>
                  <div className="mt-1 font-black"><span className="opacity-60">REWARD</span> {difficulty.reward}</div>
                  <p className="mt-4 text-sm font-bold opacity-75">{difficulty.description}</p>
                </button>
              );
            })}
          </div>
          <button type="button" onClick={onStart} className="mt-8 w-full bg-tycoon-purple hover:bg-tycoon-purpleDark text-white font-display font-black text-xl py-4 rounded-2xl border-4 border-black shadow-pop-lg pop-btn flex items-center justify-center gap-3">
            START CHECKPOINT <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [difficulty, setDifficulty] = useState('normal');

  if (screen === 'welcome') return <WelcomeDashboard onPlay={() => setScreen('difficulty')} />;
  if (screen === 'difficulty') {
    return (
      <DifficultyScreen
        selectedDifficulty={difficulty}
        onSelect={setDifficulty}
        onBack={() => setScreen('welcome')}
        onStart={() => setScreen('game')}
      />
    );
  }
  return <GameDashboard initialDifficulty={difficulty} />;
}
