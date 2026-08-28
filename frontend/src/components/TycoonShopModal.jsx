import React from 'react';
import { X, Store, Check, Sparkles, Coins, Zap, Shield, Eye } from 'lucide-react';
import { sounds } from '../utils/audio';

export default function TycoonShopModal({ 
  isOpen, 
  onClose, 
  coins, 
  upgrades, 
  onPurchaseUpgrade 
}) {
  if (!isOpen) return null;

  const SHOP_ITEMS = [
    {
      id: 'magnifier',
      name: 'Kaca Pembesar AI 🔬',
      description: 'Membuka fitur pembesar otomatis untuk membaca plat nomor berukuran kecil/buram.',
      cost: 250,
      icon: Eye,
      color: 'bg-sky-400'
    },
    {
      id: 'wiper',
      name: 'Pembersih Lumpur Garasi 🧹',
      description: 'Membuka alat pembersih untuk menyeka noda mud & debu langsung di layar inspeksi.',
      cost: 400,
      icon: Sparkles,
      color: 'bg-emerald-400'
    },
    {
      id: 'double_coins',
      name: 'Pengali Koin 2X 🪙⚡',
      description: 'Menggandakan seluruh perolehan koin setiap kali tebakanmu benar!',
      cost: 750,
      icon: Zap,
      color: 'bg-amber-400'
    },
    {
      id: 'vip_permit',
      name: 'Izin Armada Supercar VIP 🏎️',
      description: 'Membuka izin melintas kendaraan kelas tinggi dengan multiplier koin ekstra tinggi!',
      cost: 1200,
      icon: Shield,
      color: 'bg-tycoon-purple text-white'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black rounded-3xl w-full max-w-2xl shadow-pop-xl overflow-hidden animate-drive-in">
        
        {/* Header */}
        <div className="bg-tycoon-purple text-white p-5 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400 p-2 rounded-2xl border-3 border-black text-black">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-2xl tracking-wide">GARASI TYCOON SHOP</h2>
              <p className="text-xs text-purple-200 font-bold">Beli Upgrade Alat & Booster Pendapatan Koin</p>
            </div>
          </div>

          <button
            onClick={() => { sounds.playPop(); onClose(); }}
            className="bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-2xl border-3 border-black shadow-pop-sm pop-btn"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current Balance Bar */}
        <div className="bg-amber-100 px-6 py-3 border-b-4 border-black flex items-center justify-between">
          <span className="font-bold text-sm text-amber-950">SALDO KOIN SAAT INI:</span>
          <div className="flex items-center gap-2 bg-amber-400 border-2 border-black rounded-full px-3 py-1 font-extrabold text-black">
            <Coins className="w-5 h-5 text-amber-950 fill-amber-300" />
            <span className="text-lg">{coins.toLocaleString()} COINS</span>
          </div>
        </div>

        {/* Shop Items List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {SHOP_ITEMS.map((item) => {
            const isPurchased = upgrades[item.id];
            const canAfford = coins >= item.cost;
            const Icon = item.icon;

            return (
              <div 
                key={item.id}
                className="bg-gray-50 border-3 border-black rounded-2xl p-4 shadow-pop-sm flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-yellow-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3.5 rounded-2xl border-3 border-black shadow-pop-sm ${item.color}`}>
                    <Icon className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-black">{item.name}</h3>
                    <p className="text-xs text-gray-600 font-semibold max-w-sm">{item.description}</p>
                  </div>
                </div>

                <div className="w-full sm:w-auto shrink-0">
                  {isPurchased ? (
                    <div className="bg-emerald-400 text-black border-3 border-black rounded-xl px-4 py-2 font-extrabold text-sm flex items-center justify-center gap-1.5 shadow-pop-sm">
                      <Check className="w-5 h-5" /> TERBELI
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (canAfford) {
                          sounds.playCoin();
                          onPurchaseUpgrade(item.id, item.cost);
                        } else {
                          sounds.playError();
                        }
                      }}
                      disabled={!canAfford}
                      className={`w-full sm:w-auto border-3 border-black rounded-xl px-5 py-2.5 font-extrabold text-sm flex items-center justify-center gap-2 shadow-pop-sm pop-btn transition-all ${
                        canAfford 
                          ? 'bg-amber-400 hover:bg-amber-500 text-black' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-400'
                      }`}
                    >
                      <Coins className="w-4 h-4 fill-amber-300" />
                      <span>{item.cost} COINS</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
