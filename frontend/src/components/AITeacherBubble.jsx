import React from 'react';
import { Bot, CheckCircle2, AlertTriangle, Cpu, Sparkles } from 'lucide-react';

export default function AITeacherBubble({ 
  remarks, 
  status, // 'idle', 'loading', 'correct', 'incorrect'
  apilogyUsed, 
  confidenceScore, 
  hintText, 
  showHint,
  onToggleInspector
}) {
  return (
    <div className="relative w-full max-w-xl mx-auto mb-3 z-10">
      <div className={`relative bg-white border-4 border-black rounded-3xl p-4 shadow-pop transition-all transform duration-300 ${
        status === 'correct' ? 'border-emerald-500 bg-emerald-50 scale-102' : 
        status === 'incorrect' ? 'border-rose-500 bg-rose-50 animate-shake' : ''
      }`}>
        
        {/* Dialogue Bubble Tail */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-r-4 border-b-4 border-black rotate-45"></div>

        <div className="flex items-start gap-3">
          {/* AI Teacher Avatar */}
          <div className={`relative shrink-0 rounded-2xl p-2.5 border-3 border-black shadow-pop-sm flex items-center justify-center ${
            status === 'correct' ? 'bg-emerald-400' :
            status === 'incorrect' ? 'bg-rose-400' :
            'bg-tycoon-purple text-white'
          }`}>
            <span className="text-3xl select-none">
              {status === 'correct' ? '🤖🌟' : status === 'incorrect' ? '🧐❓' : '🤖🎓'}
            </span>
          </div>

          {/* Speech Bubble Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-black tracking-wide">
                  GURU AI EVALUATOR
                </span>
                {apilogyUsed && (
                  <span className="bg-sky-200 text-sky-900 border-2 border-black rounded-full px-2 py-0.5 text-[10px] font-black flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-sky-700" /> APILOGY VISION
                  </span>
                )}
              </div>
              {confidenceScore > 0 && status === 'correct' && (
                <span className="bg-emerald-200 text-emerald-900 border-2 border-black rounded-full px-2 py-0.5 text-[10px] font-black">
                  AKURASI: {confidenceScore}%
                </span>
              )}
            </div>

            {/* Main AI Teacher Dialogue Text */}
            <p className="font-bold text-base md:text-lg text-gray-900 leading-snug">
              {status === 'loading' ? (
                <span className="flex items-center gap-2 text-tycoon-purple">
                  <span className="inline-block animate-spin">🌀</span> Memeriksa data plat dengan AI BigVision...
                </span>
              ) : remarks || "Halo Pengawal! Ketik nomor plat mobil di bawah ini lalu tekan PERIKSA!"}
            </p>

            {/* Hint Box if toggled */}
            {showHint && hintText && (
              <div className="mt-2 bg-yellow-100 border-2 border-dashed border-amber-600 rounded-xl p-2 flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" /> HINT GURU: {hintText}
                </span>
                <button 
                  onClick={onToggleInspector}
                  className="bg-amber-400 hover:bg-amber-500 text-black border-2 border-black rounded-lg px-2 py-1 text-[11px] font-extrabold"
                >
                  🔍 Kaca Pembesar
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
