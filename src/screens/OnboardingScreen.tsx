/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, User, Check, Sparkles } from 'lucide-react';
import { audioService } from '../services/audioService';

interface OnboardingScreenProps {
  onComplete: (data: { name: string, gender: 'female' | 'male' }) => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'female' | 'male' | null>(null);

  const handleNext = () => {
    audioService.playClick();
    if (step === 1 && name.trim()) {
      setStep(2);
    } else if (step === 2 && gender) {
      onComplete({ name, gender });
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md text-center"
          >
            <div className="w-24 h-24 bg-pink-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                <User className="w-12 h-12 text-pink-500" />
            </div>
            <h1 className="text-3xl font-black text-[#191c1d] mb-4">Hello! What's your name?</h1>
            <p className="text-[#837375] mb-8 font-medium">We'll use this to personalize your journey.</p>
            
            <div className="relative mb-12">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    placeholder="Enter your name"
                    className="w-full h-16 bg-[#f8f9fa] border-2 border-[#e1e3e4] rounded-2xl px-6 text-xl font-bold focus:border-pink-500 focus:outline-none transition-all"
                />
                {name.trim() && (
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"
                    >
                        <Check className="w-6 h-6" />
                    </motion.div>
                )}
            </div>

            <button
                disabled={!name.trim()}
                onClick={handleNext}
                className={`w-full h-16 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all ${name.trim() ? 'bg-pink-500 text-white shadow-lg' : 'bg-[#e5e5e5] text-[#afafaf] cursor-not-allowed'}`}
            >
                Next <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md text-center"
          >
            <div className="w-24 h-24 bg-pink-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                <Sparkles className="w-12 h-12 text-pink-500" />
            </div>
            <h1 className="text-3xl font-black text-[#191c1d] mb-4">Choose your vibe</h1>
            <p className="text-[#837375] mb-8 font-medium">This changes the colors of your app.</p>
            
            <div className="grid grid-cols-2 gap-6 mb-12">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { audioService.playClick(); setGender('female'); }}
                    className={`aspect-square rounded-[40px] border-4 flex flex-col items-center justify-center gap-2 transition-all ${gender === 'female' ? 'border-pink-500 bg-pink-50 shadow-lg' : 'border-[#e1e3e4] bg-[#f8f9fa]'}`}
                >
                    <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center text-3xl">🌸</div>
                    <span className={`font-black uppercase tracking-widest ${gender === 'female' ? 'text-pink-600' : 'text-[#837375]'}`}>Sakura Pink</span>
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { audioService.playClick(); setGender('male'); }}
                    className={`aspect-square rounded-[40px] border-4 flex flex-col items-center justify-center gap-2 transition-all ${gender === 'male' ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-[#e1e3e4] bg-[#f8f9fa]'}`}
                >
                    <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-3xl">🌊</div>
                    <span className={`font-black uppercase tracking-widest ${gender === 'male' ? 'text-blue-600' : 'text-[#837375]'}`}>Sky Blue</span>
                </motion.button>
            </div>

            <button
                disabled={!gender}
                onClick={handleNext}
                className={`w-full h-16 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all ${gender ? (gender === 'female' ? 'bg-pink-500 text-white shadow-lg' : 'bg-blue-500 text-white shadow-lg') : 'bg-[#e5e5e5] text-[#afafaf] cursor-not-allowed'}`}
            >
                Let's Go! <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
