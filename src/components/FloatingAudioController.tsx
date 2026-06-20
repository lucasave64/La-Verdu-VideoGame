/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, MessageSquareCode, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioManager } from '../utils/audio';

export default function FloatingAudioController() {
  const [isOpen, setIsOpen] = useState(false);
  const [musicMuted, setMusicMuted] = useState(audioManager.isMusicMuted());
  const [sfxMuted, setSfxMuted] = useState(audioManager.isSfxMuted());

  // Periodically sync in case of changes from other locations
  useEffect(() => {
    const timer = setInterval(() => {
      setMusicMuted(audioManager.isMusicMuted());
      setSfxMuted(audioManager.isSfxMuted());
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const handleToggleMusic = () => {
    const nextMuted = !musicMuted;
    audioManager.setMusicMuted(nextMuted);
    setMusicMuted(nextMuted);
    if (!nextMuted) {
      audioManager.playClick();
    }
  };

  const handleToggleSfx = () => {
    const nextMuted = !sfxMuted;
    audioManager.setSfxMuted(nextMuted);
    setSfxMuted(nextMuted);
    if (!nextMuted) {
      audioManager.playClick();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white rounded-3xl p-5 shadow-[0_12px_30px_-4px_rgba(0,0,0,0.12)] border-2 border-gray-150 w-72 flex flex-col gap-4 text-left select-none relative"
          >
            {/* Arrow accent bubble */}
            <div className="absolute right-6 -bottom-2 w-4 h-4 bg-white border-r-2 border-b-2 border-gray-150 rotate-45"></div>

            <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <span className="text-base text-brand-green">🎮</span>
              <h3 className="font-black text-xs text-gray-800 tracking-wide uppercase">Control de Sonido</h3>
            </div>

            {/* Background Music Toggle */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl border ${musicMuted ? 'bg-gray-50 text-gray-400 border-gray-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                  <Music className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xs text-gray-800">Música de fondo</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{musicMuted ? "Silenciada" : "Reproduciendo"}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleMusic}
                className={`py-1.5 px-3 rounded-2xl font-black text-[10px] sm:text-xs tracking-wider transition-all border-2 cursor-pointer ${
                  musicMuted
                    ? 'border-gray-200 text-gray-500 bg-gray-50 hover:bg-gray-100'
                    : 'bg-emerald-50 border-emerald-350 text-emerald-700 shadow-[0_3px_0_0_#10B981] hover:bg-emerald-100 font-black'
                }`}
              >
                {musicMuted ? "ACTIVAR" : "SILENCIAR"}
              </button>
            </div>

            {/* SFX Sound Effects Toggle */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl border ${sfxMuted ? 'bg-gray-50 text-gray-400 border-gray-200' : 'bg-purple-50 text-purple-600 border-purple-200'}`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xs text-gray-800">Efectos (SFX)</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{sfxMuted ? "Silenciados" : "Activados"}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleSfx}
                className={`py-1.5 px-3 rounded-2xl font-black text-[10px] sm:text-xs tracking-wider transition-all border-2 cursor-pointer ${
                  sfxMuted
                    ? 'border-gray-200 text-gray-500 bg-gray-50 hover:bg-gray-100'
                    : 'bg-emerald-50 border-emerald-350 text-emerald-700 shadow-[0_3px_0_0_#10B981] hover:bg-emerald-100 font-black'
                }`}
              >
                {sfxMuted ? "ACTIVAR" : "SILENCIAR"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => {
          audioManager.playClick();
          setIsOpen(!isOpen);
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all select-none cursor-pointer shadow-[0_6px_16px_rgba(0,0,0,0.15)] md:shadow-[0_8px_20px_rgba(0,0,0,0.12)] border-2 ${
          (musicMuted && sfxMuted)
            ? 'bg-gray-150 border-gray-300 text-gray-400 shadow-[0_4px_0_0_#cbd5e1]'
            : 'bg-brand-green border-brand-green-dark text-white hover:bg-[#62e402] shadow-[0_4px_0_0_#46A302]'
        }`}
        title="Configurar Audio"
      >
        {(musicMuted && sfxMuted) ? (
          <VolumeX className="w-6 h-6" />
        ) : (
          <Volume2 className={`w-6 h-6 ${!musicMuted ? 'animate-pulse' : ''}`} />
        )}

        {/* Small badge if any is muted */}
        {(musicMuted || sfxMuted) && (
          <span className="absolute -top-1 -right-1 bg-amber-400 border border-white text-gray-900 rounded-full w-5 h-5 flex items-center justify-center font-black text-[9px] shadow-sm select-none">
            !
          </span>
        )}
      </motion.button>
    </div>
  );
}
