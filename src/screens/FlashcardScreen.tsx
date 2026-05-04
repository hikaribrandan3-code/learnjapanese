/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Volume2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { speechService } from '../services/speechService';
import { audioService } from '../services/audioService';

interface FlashcardScreenProps {
  onClose: () => void;
  onNext: () => void;
}

export default function FlashcardScreen({ onClose, onNext }: FlashcardScreenProps) {
  const [toggle, setToggle] = useState<'romaji' | 'hiragana' | 'kanji'>('romaji');
  const [rotation, setRotation] = useState(0);
  const phrase = "こんにちは"; // Using the actual hiragana for better TTS accuracy
  const displayPhrase = toggle === 'romaji' ? 'Konnichiwa' : toggle === 'hiragana' ? 'こんにちは' : '今日は';

  useEffect(() => {
    // Play audio on initial load
    const timer = setTimeout(() => {
      speechService.speak(phrase);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayAudio = () => {
    audioService.playClick();
    speechService.speak(phrase);
  };

  const handleToggle = (mode: 'romaji' | 'hiragana' | 'kanji') => {
    if (mode === toggle) return;
    audioService.playClick();
    setToggle(mode);
    setRotation(prev => prev + 360);
  };

  const handleNext = () => {
    audioService.playClick();
    onNext();
  };

  const handleClose = () => {
    audioService.playClick();
    onClose();
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col px-6 pt-4 pb-2 bg-white/90 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-100">
            <X className="w-6 h-6 text-[#514345]" />
          </button>
          <div className="flex-grow mx-6">
            <div className="h-3 w-full bg-[#baeaff] rounded-full overflow-hidden relative shadow-inner">
              <div className="absolute top-0 left-0 h-full bg-[#edc800] rounded-full w-3/4 shadow-sm transition-all duration-500"></div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-primary-container px-3 py-1.5 rounded-full text-on-primary-container font-bold shadow-sm">
            <Heart className="w-4 h-4 fill-primary" />
            <span className="text-sm">3</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-20 pb-32 max-w-md mx-auto w-full relative" style={{ perspective: '1200px' }}>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, rotateY: rotation }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ 
            rotateY: { type: 'spring', stiffness: 100, damping: 15 },
            scale: { type: 'spring', stiffness: 300, damping: 20 },
            default: { duration: 0.5 }
          }}
          className="w-full bg-white rounded-3xl shadow-xl border border-[#e1e3e4] p-10 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden"
        >
          {/* Subtle decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-container/10 to-transparent opacity-50"></div>
          
          <div className="relative z-10 flex flex-col items-center space-y-6 w-full">
            <div className="bg-primary/10 text-primary font-label text-xs uppercase font-bold px-4 py-2 rounded-full tracking-widest">
              Greetings
            </div>
            
            <h2 className="text-5xl font-extrabold text-[#191c1d] text-center mb-2 tracking-tight overflow-hidden pb-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={displayPhrase}
                  initial={{ y: 15, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -15, opacity: 0, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="block"
                >
                  {displayPhrase}
                </motion.span>
              </AnimatePresence>
            </h2>
            <p className="text-xl text-[#514345] font-medium text-center mb-8">Hello / Good afternoon</p>
            
            <button 
              onClick={handlePlayAudio}
              className="h-16 w-16 bg-secondary-container text-secondary rounded-full flex items-center justify-center shadow-lg transform transition-transform active:scale-95 border-b-4 border-secondary/20 hover:bg-[#baeaff]"
            >
              <Volume2 className="w-8 h-8 fill-secondary/10" />
            </button>
          </div>

          <div className="absolute -bottom-6 -right-6 w-36 h-36 opacity-20 pointer-events-none">
            <img 
              alt="Mochi Mascot" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQFG-c41xcgG6i7JBUKSRfW3Klq4jKTYyXOqjX3b49R6b6eW_DdFIzUT3uHU-SSDp9n48oBmQZEQbElfiFclP7jNZ17Kew_W9uMuGyJuSbVzIdvG0H1cRydyXo-Rh2sJLslXYOD7Tep2L6NlCP09FY8WAvTwUsndTtMm9ULnkl5JlkwkRKlolm4-eS6gSW-wXkDRk8dQM2-4ScmUA7fdXFHe0zMn9rXoZpQAtxH7vmg-CEbDwGtB30rsWaCNrUjsspk7l_PZKzFIVy" 
              className="w-full h-full object-contain grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Toggle */}
        <div className="mt-8 bg-[#edeeef] rounded-full p-1 flex shadow-sm border border-[#e1e3e4]">
          <button 
            onClick={() => handleToggle('romaji')}
            className={`px-6 py-2 rounded-full font-label text-[10px] font-bold transition-all ${toggle === 'romaji' ? 'bg-white text-[#191c1d] shadow-sm' : 'text-[#837375]'}`}
          >
            Romaji
          </button>
          <button 
            onClick={() => handleToggle('hiragana')}
            className={`px-6 py-2 rounded-full font-label text-[10px] font-bold transition-all ${toggle === 'hiragana' ? 'bg-white text-[#191c1d] shadow-sm' : 'text-[#837375]'}`}
          >
            Hiragana
          </button>
          <button 
            onClick={() => handleToggle('kanji')}
            className={`px-6 py-2 rounded-full font-label text-[10px] font-bold transition-all ${toggle === 'kanji' ? 'bg-white text-[#191c1d] shadow-sm' : 'text-[#837375]'}`}
          >
            Kanji
          </button>
        </div>
      </main>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-[#e1e3e4]">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handleNext}
            className="w-full btn-primary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
