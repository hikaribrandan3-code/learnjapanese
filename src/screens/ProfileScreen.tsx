/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Settings, LogOut, Award, ShieldCheck, Camera, Edit2, Check, Heart } from 'lucide-react';
import { Screen, UserProfile } from '../types';
import BottomNav from '../components/BottomNav';
import { audioService } from '../services/audioService';
import { useState } from 'react';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  userProfile: UserProfile;
  onUpdateProfile: (updates: { name?: string, avatar?: string, gender?: 'female' | 'male' }) => void;
  isInfiniteHearts: boolean;
  onToggleInfiniteHearts: () => void;
  onLogout: () => void;
}

const AVATAR_OPTIONS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA9hmaI445ZqO4evqDvsgCo6t_6u60g1NZCzXjRr21BqzHr2Pe3-Tccs-iwvfpFO0G7iU-FdvcrmkxftzTzMv6xt8OdYjzeQsE9TZWnUXXoZZuZejGbBoS411qYZ_VKpYI_fWjB02IHDj5vh-4Jtewh6vwrOUhL3H3HvP_vFQ3q54h1Z4nkDz50zfnajcml_bDgbp1VbOYDHaO6wpyUmASG96FMd_ypxSDucGOMuiRszpa0-rgFBbam8PdZDy1I2EDywGv-mYzEduRg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDNZMyN82EaOFZv7DkKbp3bAY5Xg2drfgcMGaGq91bmaemRWpuBCKq0zSzWsIol0CilqAar1MbqC35DlRV73RWbb2zeW6hOz5wkespEO-YgQnm2UMxIPFUngtBc8Kde1oId3cnec0-Caq0Nj228GkbLhZyuCcIf31zMwQAQ284o04-cnTmTEbFnFCzzoKwdSog6J6IhcJdCZMoH4AH63L8F62ZKfpZaL7pUYhhNQhLS4-uP0OJ3BeU1mHyd-CCGOLQpn9-NG5LcxcYV',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCwh0Pd-lu4AkcXR7L-bqH8ar7wcJqUHE_mZcAZIXQTna5g34EiEM2BVFQ_oiKi7r9rxepNF9SdO2ksJweMa6GeTTRpMNAQ4d57cbpfyFo3rnT4NIqEIkhX6Tq56H38LUgvPWDJ7-QCFBsyx5swukCi3RXqt_oNEoVNKCIHE2ETY6LH-nfFbtkTDR5431v8LCYp96ABtgEZuwte1CQHD7UUkbQWasvX6Ci2iJvzOcivIoH4GgklnsaKoau6ky7-BMDFv7C5b5gH-3p-',
];

export default function ProfileScreen({ onNavigate, userProfile, onUpdateProfile, isInfiniteHearts, onToggleInfiniteHearts, onLogout }: ProfileScreenProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleNavigate = (screen: Screen) => {
    audioService.playClick();
    onNavigate(screen);
  };

  const handleClick = () => {
    audioService.playClick();
  };

  const handleSaveName = () => {
    audioService.playClick();
    onUpdateProfile({ name: tempName });
    setIsEditingName(false);
  };

  const handleSelectAvatar = (url: string) => {
    audioService.playClick();
    onUpdateProfile({ avatar: url });
    setShowAvatarPicker(false);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen relative font-sans">
      <header className="px-6 pt-12 pb-10 flex justify-between items-start">
        <h1 className="text-3xl font-black text-[#191c1d] tracking-tight">Profile</h1>
        <button onClick={handleClick} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Settings className="w-6 h-6 text-[#837375]" />
        </button>
      </header>

      <main className="px-6 pb-32 max-w-lg mx-auto">
        {/* User Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-[#e1e3e4] flex flex-col items-center mb-8 relative"
        >
          <div className="relative mb-4">
            <div className={`w-24 h-24 rounded-full border-4 ${userProfile.gender === 'male' ? 'border-blue-100' : 'border-pink-100'} p-1`}>
              <img 
                alt="Profile Avatar" 
                src={userProfile.avatar} 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <button 
              onClick={() => { audioService.playClick(); setShowAvatarPicker(true); }}
              className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="w-full flex flex-col items-center">
            {isEditingName ? (
              <div className="flex items-center gap-2 w-full justify-center">
                <input 
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  autoFocus
                  className="text-2xl font-black text-[#191c1d] border-b-2 border-primary outline-none bg-transparent text-center px-2 py-1 max-w-[200px]"
                />
                <button 
                  onClick={handleSaveName}
                  className="p-2 bg-secondary text-white rounded-full"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                <h2 className="text-2xl font-black text-[#191c1d]">{userProfile.name}</h2>
                <Edit2 className="w-4 h-4 text-[#837375] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
            
            <p className="text-[#837375] font-medium flex items-center gap-1 mt-1">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              Verified Student
            </p>
          </div>

          {/* Avatar Choice Modal */}
          <AnimatePresence>
            {showAvatarPicker && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-x-4 top-4 bottom-4 bg-white z-50 rounded-2xl shadow-xl p-6 border border-outline-variant flex flex-col items-center"
              >
                <div className="flex justify-between w-full mb-6 items-center">
                  <h3 className="font-bold text-lg">Pick an Avatar</h3>
                  <button onClick={() => setShowAvatarPicker(false)} className="text-[#837375]"><LogOut className="w-5 h-5 rotate-180" /></button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {AVATAR_OPTIONS.map((url, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSelectAvatar(url)}
                      className={`w-16 h-16 rounded-full border-2 p-1 overflow-hidden transition-all ${userProfile.avatar === url ? 'border-primary ring-2 ring-primary-container' : 'border-transparent hover:border-outline'}`}
                    >
                      <img src={url} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" alt={`Avatar option ${i}`} />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-[#e1e3e4] shadow-sm">
            <p className="text-[10px] uppercase font-black tracking-widest text-[#837375] mb-1">XP Points</p>
            <p className="text-2xl font-black text-primary">1,250</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#e1e3e4] shadow-sm">
            <p className="text-[10px] uppercase font-black tracking-widest text-[#837375] mb-1">Daily Streak</p>
            <p className="text-2xl font-black text-tertiary">12 days</p>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white rounded-3xl p-6 border border-[#e1e3e4] shadow-sm mb-8">
            <h3 className="font-black text-sm uppercase tracking-widest text-[#837375] mb-4">App Theme</h3>
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => onUpdateProfile({ gender: 'female' })}
                    className={`h-12 rounded-xl font-bold transition-all border-2 ${userProfile.gender === 'female' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-[#e1e3e4] text-[#837375]'}`}
                >
                    Sakura Pink
                </button>
                <button 
                    onClick={() => onUpdateProfile({ gender: 'male' })}
                    className={`h-12 rounded-xl font-bold transition-all border-2 ${userProfile.gender === 'male' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-[#e1e3e4] text-[#837375]'}`}
                >
                    Sky Blue
                </button>
            </div>
        </div>

        {/* Super Sakura Unlock */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          onClick={() => { audioService.playClick(); onToggleInfiniteHearts(); }}
          className={`mb-8 p-6 rounded-3xl cursor-pointer transition-all border-2 relative overflow-hidden group ${isInfiniteHearts ? 'bg-primary border-primary shadow-lg' : 'bg-white border-primary/20'}`}
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isInfiniteHearts ? 'bg-white text-primary' : 'bg-primary-container text-primary'}`}>
                <Heart className={`w-6 h-6 ${isInfiniteHearts ? 'animate-pulse fill-primary' : ''} fill-current`} />
              </div>
              <div>
                <h3 className={`font-black text-lg ${isInfiniteHearts ? 'text-white' : 'text-[#191c1d]'}`}>Super Sakura</h3>
                <p className={`font-bold text-sm ${isInfiniteHearts ? 'text-white/80' : 'text-[#837375]'}`}>
                  {isInfiniteHearts ? 'Infinite Hearts Enabled' : 'Unlock Infinite Hearts'}
                </p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full p-1 transition-colors ${isInfiniteHearts ? 'bg-white' : 'bg-slate-100'}`}>
              <motion.div 
                animate={{ x: isInfiniteHearts ? 24 : 0 }}
                className={`w-6 h-6 rounded-full shadow-sm ${isInfiniteHearts ? 'bg-primary' : 'bg-white'}`}
              />
            </div>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
             <Heart className="w-24 h-24 rotate-12 fill-current" />
          </div>
        </motion.div>

        {/* Actions */}
        <div className="space-y-3">
          <button onClick={handleClick} className="w-full h-14 bg-white border border-[#e1e3e4] rounded-2xl flex items-center px-5 gap-4 hover:bg-slate-50 transition-colors">
            <Award className="w-5 h-5 text-secondary" />
            <span className="font-bold text-[#191c1d]">Achievements</span>
          </button>
          <button onClick={() => { audioService.playClick(); onLogout(); }} className="w-full h-14 bg-white border border-[#e1e3e4] rounded-2xl flex items-center px-5 gap-4 hover:bg-red-50 text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-bold">Log out</span>
          </button>
        </div>
      </main>

      <BottomNav currentScreen={Screen.PROFILE} onNavigate={handleNavigate} />
    </div>
  );
}
