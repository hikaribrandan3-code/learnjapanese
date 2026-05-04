/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Target, CheckCircle2, Trophy } from 'lucide-react';
import { Goal, Screen } from '../types';
import BottomNav from '../components/BottomNav';
import { audioService } from '../services/audioService';
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface GoalsScreenProps {
  goals: Goal[];
  onNavigate: (screen: Screen) => void;
}

export default function GoalsScreen({ goals, onNavigate }: GoalsScreenProps) {
  const allCompleted = goals.every(g => g.current >= g.target);
  const confettiTriggered = useRef(false);

  useEffect(() => {
    if (allCompleted && !confettiTriggered.current) {
      confettiTriggered.current = true;
      audioService.playSuccess();
      
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [allCompleted]);

  const handleNavigate = (screen: Screen) => {
    audioService.playClick();
    onNavigate(screen);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen relative font-sans">
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-black text-[#191c1d] tracking-tight">Daily Goals</h1>
        <p className="text-[#514345]">Keep the momentum going!</p>
      </header>

      <main className="px-6 pb-32 max-w-lg mx-auto">
        {/* Streak / High Level Progress */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-[#e1e3e4] mb-8 relative overflow-hidden"
        >
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 bg-tertiary-container/20 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-tertiary fill-tertiary/10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#191c1d]">Daily Streak: 12</h3>
              <p className="text-sm text-[#837375]">Finish all goals for a bonus!</p>
            </div>
          </div>
          {allCompleted && (
            <div className="absolute top-0 right-0 p-4 bg-tertiary text-white text-[10px] uppercase font-black tracking-widest rounded-bl-xl">
              Completed
            </div>
          )}
        </motion.div>

        {/* Goals List */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-[#837375] uppercase tracking-widest pl-2">Today's Objectives</h2>
          {goals.map((goal, idx) => {
            const progress = Math.min(1, goal.current / goal.target);
            const isDone = progress >= 1;

            return (
              <motion.div
                key={goal.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-[#e1e3e4] flex items-center gap-4 group"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform ${isDone ? 'bg-secondary-container' : 'bg-[#edeeef]'}`}>
                  <span className="text-2xl">{goal.icon}</span>
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-end mb-2">
                    <h4 className="font-bold text-[#191c1d]">{goal.title}</h4>
                    <span className="text-xs font-bold text-[#837375]">{goal.current}/{goal.target}</span>
                  </div>
                  
                  <div className="h-3 bg-[#edeeef] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                      className={`h-full rounded-full ${isDone ? 'bg-secondary shadow-[0_0_8px_rgba(12,103,128,0.3)]' : 'bg-primary-container'}`}
                    />
                  </div>
                </div>

                <div className="flex-shrink-0 ml-2">
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-secondary fill-secondary/10" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-[#d6c2c4]" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Motivation Card */}
        <div className="mt-8 bg-primary/5 rounded-3xl p-6 border border-primary/10 flex items-center gap-4">
          <Target className="w-10 h-10 text-primary opacity-50" />
          <p className="text-sm text-primary font-medium italic">
            "Every step forward, no matter how small, brings you closer to fluency."
          </p>
        </div>
      </main>

      <BottomNav currentScreen={Screen.GOALS} onNavigate={handleNavigate} />
    </div>
  );
}
