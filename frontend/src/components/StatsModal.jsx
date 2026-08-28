import React from 'react';
import { X, BarChart3, Award, Target, Flame, Coins } from 'lucide-react';
import { sounds } from '../utils/audio';

export default function StatsModal({ isOpen, onClose, stats }) {
  if (!isOpen) return null;

  const total = stats.totalChecked || 0;
  const correct = stats.totalCorrect || 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black rounded-3xl w-full max-w-lg shadow-pop-xl overflow-hidden animate-drive-in">
        
        {/* Header */}
        <div className="bg-tycoon-sky text-black p-5 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-2xl border-3 border-black">
              <BarChart3 className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-2xl">STATISTIK TYCOON</h2>
              <p className="text-xs font-bold text-gray-700">Performa AI Gatekeeper Pengawal Jalanan</p>
            </div>
          </div>

          <button
            onClick={() => { sounds.playPop(); onClose(); }}
            className="bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-2xl border-3 border-black shadow-pop-sm pop-btn"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="p-6 grid grid-cols-2 gap-4 bg-gray-50">
          
          <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-pop-sm flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-xl border-2 border-black text-tycoon-purple">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-black">{total}</div>
              <div className="text-xs font-bold text-gray-500">Total Kendaraan</div>
            </div>
          </div>

          <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-pop-sm flex items-center gap-3">
            <div className="bg-emerald-100 p-3 rounded-xl border-2 border-black text-emerald-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-black">{correct}</div>
              <div className="text-xs font-bold text-gray-500">Tebakan Tepat</div>
            </div>
          </div>

          <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-pop-sm flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-xl border-2 border-black text-yellow-600">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-black">{accuracy}%</div>
              <div className="text-xs font-bold text-gray-500">Tingkat Akurasi</div>
            </div>
          </div>

          <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-pop-sm flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-xl border-2 border-black text-orange-500">
              <Flame className="w-6 h-6 fill-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-black">{stats.highestStreak || 0}</div>
              <div className="text-xs font-bold text-gray-500">Rekor Streak</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
