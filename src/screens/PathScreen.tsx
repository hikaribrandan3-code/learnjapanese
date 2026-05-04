/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Map, Medal, User, Flame, CheckCircle, Lock, Heart } from 'lucide-react';
import { Screen } from '../types';
import BottomNav from '../components/BottomNav';
import { audioService } from '../services/audioService';

interface PathScreenProps {
  onStartLesson: () => void;
  onNavigate: (screen: Screen) => void;
  userProfile: { name: string, avatar: string, gender: 'female' | 'male' };
  hearts: number;
  isInfiniteHearts: boolean;
  unlockedLevels: number;
}

export default function PathScreen({ onStartLesson, onNavigate, userProfile, hearts, isInfiniteHearts, unlockedLevels }: PathScreenProps) {
  const handleStartLesson = () => {
    audioService.playClick();
    onStartLesson();
  };

  const handleNavigate = (screen: Screen) => {
    audioService.playClick();
    onNavigate(screen);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen relative font-sans">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 bg-white/90 backdrop-blur-md rounded-full mt-4 mx-4 border-2 border-primary-container shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border border-primary/20">
            <img 
              alt="Avatar" 
              className="w-full h-full object-cover"
              src={userProfile.avatar}
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-xl font-black tracking-tight text-primary">Sakura Learn</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-primary-container/20 px-3 py-1.5 rounded-full border border-primary/10">
            <Heart className={`w-5 h-5 fill-primary text-primary ${isInfiniteHearts ? 'animate-pulse' : ''}`} />
            <span className="font-black text-primary tabular-nums">{isInfiniteHearts ? '∞' : hearts}</span>
          </div>
          <div className="flex items-center gap-1 bg-[#f3f4f5] px-3 py-1.5 rounded-full">
            <span className="font-bold text-lg text-primary">12</span>
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 pt-28 pb-32 flex flex-col items-center">
        <div className="text-center mb-10 w-full">
          <h1 className="text-3xl font-extrabold text-[#191c1d] mb-2 tracking-tight">Level 1: Greetings</h1>
          <p className="text-lg text-[#514345] font-medium">Start your journey here!</p>
        </div>

        {/* Path Map */}
        <div className="relative flex flex-col items-center w-full py-8 gap-12">
          {/* Path Line */}
          <div className="absolute top-0 bottom-0 w-3 bg-[#e1e3e4] rounded-full -z-10 left-1/2 transform -translate-x-1/2"></div>
          
          {/* Completed Node */}
          <div className="relative flex justify-center w-full">
            <button className={`w-20 h-20 rounded-full ${unlockedLevels > 1 ? 'bg-primary-container text-primary shadow-md border-white border-4' : 'bg-[#f3f4f5] text-[#837375] opacity-50'} flex items-center justify-center transition-transform hover:-translate-y-1 active:translate-y-0`}>
              {unlockedLevels > 1 ? <CheckCircle className="w-10 h-10 fill-primary/20" /> : <span className="text-3xl">🏮</span>}
            </button>
          </div>

          {/* Active Node */}
          <div className="relative flex justify-center w-full my-4">
             {unlockedLevels === 1 && (
                <motion.div 
                    initial={{ y: 0 }}
                    animate={{ y: -10 }}
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
                    className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white text-[#191c1d] px-6 py-3 rounded-xl shadow-lg border border-primary/20 flex items-center gap-3 z-20 whitespace-nowrap"
                >
                    <p className="font-black text-sm text-primary uppercase tracking-wider">Start Lesson!</p>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b border-r border-primary/20"></div>
                </motion.div>
             )}

            <button 
              onClick={unlockedLevels >= 1 ? handleStartLesson : undefined}
              className={`w-24 h-24 rounded-full bg-white shadow-xl border-4 flex items-center justify-center transition-transform hover:-translate-y-2 active:translate-y-0 relative z-10 ${unlockedLevels >= 1 ? 'border-primary ring-8 ring-primary-container/50' : 'border-[#e1e3e4] grayscale opacity-50 cursor-not-allowed'}`}
            >
              <span className="text-4xl">🍣</span>
            </button>
          </div>

          {/* Node 2 */}
          <div className="relative flex justify-center w-full ml-12">
            <button 
              onClick={unlockedLevels >= 2 ? handleStartLesson : undefined}
              className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center shadow-md transition-all ${unlockedLevels >= 2 ? 'bg-white border-primary opacity-100 hover:-translate-y-1' : 'bg-[#e1e3e4] opacity-50 grayscale cursor-not-allowed'}`}
            >
              {unlockedLevels >= 2 ? <span className="text-3xl">⛩️</span> : <Lock className="w-8 h-8 text-[#837375]" />}
            </button>
             {unlockedLevels === 2 && (
                <motion.div 
                    initial={{ y: 0 }}
                    animate={{ y: -10 }}
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
                    className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white text-[#191c1d] px-4 py-2 rounded-xl shadow-lg border border-primary/20 flex items-center gap-3 z-20 whitespace-nowrap"
                >
                    <p className="font-black text-xs text-primary uppercase tracking-wider">Ready!</p>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b border-r border-primary/20"></div>
                </motion.div>
             )}
          </div>

          {/* Node 3 */}
          <div className="relative flex justify-center w-full mr-16">
            <button 
                onClick={unlockedLevels >= 3 ? handleStartLesson : undefined}
                className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center shadow-md transition-all ${unlockedLevels >= 3 ? 'bg-white border-primary opacity-100 hover:-translate-y-1' : 'bg-[#e1e3e4] opacity-50 grayscale cursor-not-allowed'}`}
            >
                 {unlockedLevels >= 3 ? <span className="text-3xl">🍵</span> : <Lock className="w-8 h-8 text-[#837375]" />}
            </button>
          </div>

          {/* Final Node */}
          <div className="relative flex justify-center w-full mt-4">
            <button 
                className={`w-24 h-24 rounded-full border-4 border-white flex items-center justify-center shadow-xl transition-all ${unlockedLevels >= 4 ? 'bg-primary text-white' : 'bg-[#edc800]/50 opacity-50 grayscale cursor-not-allowed'}`}
            >
              <Lock className="w-10 h-10 text-white" />
            </button>
          </div>
        </div>
      </main>

      {/* Navigation */}
      <BottomNav currentScreen={Screen.PATH} onNavigate={handleNavigate} />
    </div>
  );
}
