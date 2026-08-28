import React, { useState } from 'react';
import { X, Search, Sparkles, RefreshCw, ZoomIn } from 'lucide-react';
import { getPlateImageUrl } from '../utils/api';
import { sounds } from '../utils/audio';

export default function VehiclePlateInspector({ 
  isOpen, 
  onClose, 
  challenge, 
  hasWiper, 
  hasMagnifier 
}) {
  const [cleaned, setCleaned] = useState(false);

  if (!isOpen || !challenge) return null;

  const handleWipe = () => {
    sounds.playPop();
    setCleaned(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black rounded-3xl w-full max-w-xl shadow-pop-xl overflow-hidden animate-drive-in">
        
        {/* Modal Header */}
        <div className="bg-tycoon-sky text-black p-4 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 p-2 rounded-2xl border-3 border-black">
              <ZoomIn className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-xl">INSPEKSI KACA PEMBESAR PLAT</h2>
              <p className="text-xs font-bold text-gray-700">Pindai Detail Huruf & Angka Karakter</p>
            </div>
          </div>

          <button
            onClick={() => { sounds.playPop(); onClose(); }}
            className="bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-2xl border-3 border-black shadow-pop-sm pop-btn"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Plate Viewer Container */}
        <div className="p-6 flex flex-col items-center bg-gray-100">
          
          <div className={`relative border-4 border-black rounded-3xl overflow-hidden shadow-pop bg-black p-2 transition-all ${cleaned ? 'brightness-110 contrast-125' : ''}`}>
            {/* Zoomed Vehicle Image */}
            <img
              src={getPlateImageUrl(challenge.car_id)}
              alt="Zoomed Plate"
              className="w-full max-w-md h-auto rounded-2xl object-cover"
            />

            {/* Magnifier Reticle Overlay */}
            <div className="absolute inset-0 border-4 border-yellow-400/60 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-dashed border-white rounded-full animate-ping opacity-40"></div>
            </div>
          </div>

          {/* Wiper Tool Action */}
          <div className="mt-4 flex flex-col items-center gap-2 w-full">
            {hasWiper ? (
              <button
                onClick={handleWipe}
                className={`w-full max-w-xs border-3 border-black rounded-2xl py-3 px-4 font-extrabold text-sm shadow-pop pop-btn flex items-center justify-center gap-2 transition-all ${
                  cleaned ? 'bg-emerald-400 text-black' : 'bg-yellow-400 hover:bg-yellow-500 text-black'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>{cleaned ? 'PLAT SUDAH DIBERSIHKAN! ✨' : 'USAP & BERSIHKAN LUMPUR 🧹'}</span>
              </button>
            ) : (
              <div className="bg-amber-100 border-2 border-black rounded-2xl p-3 text-center text-xs font-bold text-amber-900 w-full max-w-md">
                💡 Tip: Beli <span className="underline">Pembersih Lumpur Garasi</span> di Toko untuk menyeka noda hitam pada plat!
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
