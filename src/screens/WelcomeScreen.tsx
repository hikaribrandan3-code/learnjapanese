/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Screen } from '../types';
import { audioService } from '../services/audioService';

interface WelcomeScreenProps {
  onStart: () => void;
  isLoggedIn: boolean;
}

export default function WelcomeScreen({ onStart, isLoggedIn }: WelcomeScreenProps) {
  const handleStart = () => {
    audioService.playClick();
    onStart();
  };

  return (
    <div className="relative min-h-screen bg-[#ffd9df] overflow-hidden flex flex-col font-sans">
      {/* Decorative Background Petals */}
      <div className="absolute top-[5%] left-[10%] w-32 h-48 bg-white/30 rounded-[50%_50%_0_50%] rotate-45 blur-md petal-float pointer-events-none"></div>
      <div className="absolute top-[60%] right-[5%] w-24 h-32 bg-white/40 rounded-[50%_50%_50%_0] -rotate-12 blur-sm petal-float-delayed pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[20%] w-40 h-40 bg-white/20 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute top-[20%] right-[15%] w-16 h-16 bg-white/50 rounded-[0_50%_50%_50%] rotate-[60deg] blur-sm petal-float pointer-events-none"></div>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 py-16 w-full max-w-md mx-auto">
        {/* Mascot Image Area */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="mb-10 relative w-64 h-64 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl"></div>
          <img 
            alt="Mascot" 
            className="relative z-10 w-52 h-52 object-cover rounded-full border-4 border-white shadow-2xl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNZMyN82EaOFZv7DkKbp3bAY5Xg2drfgcMGaGq91bmaemRWpuBCKq0zSzWsIol0CilqAar1MbqC35DlRV73RWbb2zeW6hOz5wkespEO-YgQnm2UMxIPFUngtBc8Kde1oId3cnec0-Caq0Nj228GkbLhZyuCcIf31zMwQAQ284o04-cnTmTEbFnFCzzoKwdSog6J6IhcJdCZMoH4AH63L8F62ZKfpZaL7pUYhhNQhLS4-uP0OJ3BeU1mHyd-CCGOLQpn9-NG5LcxcYV"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Welcome Typography */}
        <div className="text-center mb-10 w-full">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-display text-2xl text-primary tracking-wide mb-1 font-bold"
          >
            Welcome to
          </motion.h2>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-display text-5xl text-[#360c19] font-black tracking-tight"
          >
            Sakura Learn
          </motion.h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-4 mt-auto md:mt-0">
          <motion.button 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={handleStart}
            className="btn-primary w-full"
          >
            {isLoggedIn ? 'CONTINUE LEARNING' : 'SIGN IN & START'}
          </motion.button>
          <motion.button 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={handleStart}
            className="btn-secondary w-full"
          >
            Empezar en Español
          </motion.button>
        </div>
      </main>
    </div>
  );
}
