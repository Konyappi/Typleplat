import React from 'react';
import { Search, Eye, Sparkles } from 'lucide-react';
import { getPlateImageUrl } from '../utils/api';

export default function RoadViewport({ 
  challenge, 
  status, // 'idle', 'loading', 'driving_away', 'correct', 'incorrect'
  onOpenInspector,
  hasMagnifier
}) {
  if (!challenge) {
    return (
      <div className="w-full max-w-4xl mx-auto h-72 bg-tycoon-sky border-4 border-black rounded-3xl shadow-pop flex items-center justify-center">
        <div className="text-xl font-extrabold text-black flex items-center gap-2">
          <span className="animate-spin text-2xl">🚗</span> Memuat Mobil Baru...
        </div>
      </div>
    );
  }

  // Driving animation class on correct submission: translate-x-[500px], fade out, scale shrink
  const isDrivingAway = status === 'driving_away';

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl border-4 border-black shadow-pop-lg overflow-hidden bg-gradient-to-b from-tycoon-sky to-sky-200 p-4 md:p-6 mb-4">
      
      {/* Dynamic Sky Background Elements (Clouds & Sun) */}
      <div className="absolute top-3 left-6 text-4xl opacity-80 select-none animate-pulse">☁️</div>
      <div className="absolute top-6 right-12 text-4xl opacity-80 select-none">☁️</div>
      <div className="absolute top-2 right-4 text-5xl select-none animate-spin-slow">☀️</div>

      {/* Vehicle Archetype Badge */}
      <div className="relative z-10 flex items-center justify-between mb-2">
        <div className="bg-white border-3 border-black rounded-full px-3 py-1 text-xs font-black text-black shadow-pop-sm flex items-center gap-1.5">
          <span className="text-base">🚘</span> {challenge.vehicle_name} ({challenge.vehicle_type})
        </div>
        <div className="bg-yellow-300 border-3 border-black rounded-full px-3 py-1 text-xs font-black text-black shadow-pop-sm">
          REWARD: {Math.round(100 * challenge.coin_multiplier)} COINS 🪙
        </div>
      </div>

      {/* Main Road Viewport Area */}
      <div className="relative h-64 md:h-72 w-full rounded-2xl border-4 border-black bg-tycoon-road overflow-hidden flex flex-col justify-end shadow-inner">
        
        {/* Guardrail top border */}
        <div className="absolute top-0 w-full h-4 bg-gray-300 border-b-2 border-black bg-stripes"></div>

        {/* Road Lanes & Yellow Dashed Divider Lines */}
        <div className="absolute top-1/2 left-0 w-full h-3 -translate-y-1/2 flex items-center justify-around">
          <div className="w-12 h-full bg-yellow-400 border-2 border-black rounded-full"></div>
          <div className="w-12 h-full bg-yellow-400 border-2 border-black rounded-full"></div>
          <div className="w-12 h-full bg-yellow-400 border-2 border-black rounded-full"></div>
          <div className="w-12 h-full bg-yellow-400 border-2 border-black rounded-full"></div>
          <div className="w-12 h-full bg-yellow-400 border-2 border-black rounded-full"></div>
        </div>

        {/* Asphalt Texture details */}
        <div className="absolute bottom-2 left-0 w-full h-2 bg-gray-600 border-t-2 border-black"></div>

        {/* Animated Chibi Car Container */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          
          <div 
            className={`relative transition-all duration-700 ease-in-out transform ${
              isDrivingAway ? 'translate-x-[600px] scale-75 opacity-0 duration-700' : 
              status === 'incorrect' ? 'animate-shake' : 
              'animate-drive-in'
            }`}
          >
            {/* Display Generated Cartoon Car Image from Backend */}
            <div className="relative group">
              <img
                src={getPlateImageUrl(challenge.car_id)}
                alt={challenge.vehicle_name}
                className="w-80 md:w-96 h-auto object-contain rounded-2xl border-4 border-black shadow-pop bg-sky-200"
              />

              {/* Interactive Plate Inspection Button overlay */}
              <button
                onClick={onOpenInspector}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-yellow-400 hover:bg-yellow-500 text-black border-3 border-black rounded-full px-3 py-1 text-xs font-black shadow-pop pop-btn flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all"
                title="Perbesar & Bersihkan Plat!"
              >
                <Search className="w-3.5 h-3.5 text-black" />
                <span>INSPEKSI PLAT</span>
                {hasMagnifier && <Sparkles className="w-3.5 h-3.5 text-purple-700 fill-purple-400" />}
              </button>

            </div>

            {/* Driving Exhaust Smoke Particles */}
            {isDrivingAway && (
              <div className="absolute -left-12 bottom-4 text-3xl animate-ping">
                💨💨
              </div>
            )}
          </div>

        </div>

        {/* Road Surface Shadow overlay */}
        <div className="absolute bottom-0 w-full h-6 bg-black opacity-20 pointer-events-none"></div>
      </div>

    </div>
  );
}
