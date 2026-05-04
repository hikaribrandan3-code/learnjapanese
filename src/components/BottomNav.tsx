/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map, Medal, User, PenTool } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: Screen.PATH, label: 'Learn', icon: Map },
    { id: Screen.WRITING, label: 'Writing', icon: PenTool },
    { id: Screen.GOALS, label: 'Goals', icon: Medal },
    { id: Screen.PROFILE, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 h-20 bg-white/95 backdrop-blur-lg rounded-[32px] mb-6 mx-6 border-2 border-pink-100 shadow-xl lg:max-w-lg lg:mx-auto">
      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-2 px-5 transition-all duration-200 ${
              isActive 
                ? 'bg-pink-400 text-white rounded-full shadow-[0_4px_0_0_#f472b6] transform -translate-y-1' 
                : 'text-slate-400 hover:text-pink-400'
            }`}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'mb-1' : 'mb-1'}`} />
            <span className="text-[10px] font-extrabold uppercase tracking-widest">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
