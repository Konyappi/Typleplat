import React, { useRef, useEffect } from 'react';
import { CheckCircle2, Lightbulb, Eraser, Send } from 'lucide-react';
import { sounds } from '../utils/audio';

export default function ControlDock({ 
  inputValue, 
  setInputValue, 
  onSubmit, 
  onToggleHint, 
  showHint,
  isLoading,
  disabled
}) {
  const inputRef = useRef(null);

  // Focus when a new challenge finishes loading so typing can start immediately.
  useEffect(() => {
    if (inputRef.current && !disabled && !isLoading) {
      inputRef.current.focus();
    }
  }, [disabled, isLoading]);

  const handleChange = (e) => {
    // Convert to uppercase monospace plate format automatically
    const uppercaseVal = e.target.value.toUpperCase();
    setInputValue(uppercaseVal);
    sounds.playPop();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading && !disabled && inputValue.trim()) {
      onSubmit();
    }
  };

  const handleClear = () => {
    setInputValue('');
    sounds.playPop();
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-8 z-20 relative">
      <div className="bg-white border-4 border-black rounded-3xl p-4 md:p-6 shadow-pop-lg flex flex-col md:flex-row items-center gap-4">
        
        {/* Left Side: Monospace Uppercase License Plate Input */}
        <div className="relative flex-1 w-full">
          <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
            MASUKKAN PLAT NOMOR KENDARAAN (CONTOH: B 1402 SKS)
          </label>
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={disabled || isLoading}
              placeholder="CONTOH: B 1234 ABC"
              maxLength={12}
              className="w-full bg-yellow-50 border-4 border-black rounded-2xl px-5 py-3.5 text-2xl md:text-3xl font-extrabold plate-font uppercase tracking-widest text-black placeholder:text-gray-400 placeholder:normal-case shadow-inner focus:outline-none focus:bg-white focus:ring-4 focus:ring-tycoon-purple transition-all"
            />

            {/* Clear Input Button */}
            {inputValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 p-1.5 bg-gray-200 hover:bg-rose-400 text-gray-700 hover:text-white border-2 border-black rounded-xl transition-all"
                title="Hapus Teks"
              >
                <Eraser className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          
          {/* Hint Trigger Button */}
          <button
            type="button"
            onClick={() => { sounds.playPop(); onToggleHint(); }}
            className={`p-3.5 rounded-2xl border-4 border-black shadow-pop pop-btn transition-colors ${
              showHint ? 'bg-amber-400 text-black' : 'bg-gray-100 hover:bg-yellow-200 text-gray-700'
            }`}
            title="Minta Petunjuk Hint"
          >
            <Lightbulb className={`w-6 h-6 ${showHint ? 'fill-amber-900 text-amber-900' : ''}`} />
          </button>

          {/* Massive Tactile "CHECK ANSWER!" Button */}
          <button
            type="button"
            onClick={() => { sounds.playPop(); onSubmit(); }}
            disabled={disabled || isLoading || !inputValue.trim()}
            className="flex-1 md:flex-none bg-tycoon-purple hover:bg-tycoon-purpleDark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-display font-extrabold text-xl md:text-2xl px-8 py-4 rounded-2xl border-4 border-black shadow-pop-lg pop-btn flex items-center justify-center gap-3 transition-all"
          >
            {isLoading ? (
              <>
                <span className="animate-spin text-2xl">🌀</span>
                <span>MEMERIKSA...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-7 h-7 text-yellow-300" />
                <span>CHECK ANSWER!</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}
