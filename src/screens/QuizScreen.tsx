/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { X, Heart } from 'lucide-react';
import { useState } from 'react';
import { speechService } from '../services/speechService';
import { audioService } from '../services/audioService';

interface QuizScreenProps {
  onClose: () => void;
  onFinish: () => void;
  hearts: number;
  isInfiniteHearts: boolean;
  onLoseHeart: () => void;
}

export default function QuizScreen({ onClose, onFinish, hearts, isInfiniteHearts, onLoseHeart }: QuizScreenProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'checking' | 'correct' | 'incorrect'>('idle');

  const options = [
    { text: 'Arigato', spoke: 'ありがとう', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYFkpc34RgGihDTg7xGwOj5pPvlY2gM2XXogxn85hGkP5V4Bu-aHnQGCpbB3WiIxyI9HblZjFoV0P4QQSlPhO__bjTKAjQbXxMyjlLhddd1ZhosR5cgorIUn0fPiUH32KffqhaVUExS8f-QPRTOahBm3rNfbsnr6ZseTnEnxQRNX130H3gPIlCTa3iv3rS_mcYuAdMAHFlUAOF7kTbn1dYK6G2zhqe1IWuz_kuS0M7q04rrQg6ZOHkZybsjF2h0D2jNsEYCVopgz42' },
    { text: 'Sayonara', spoke: 'さようなら', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfwBNd0S4wOJAm00BK0xbCsUl3eXzKDe0_RIOhF7rjJYy6dUdiM95zUMx2JiiSod-Q26Kg2xSAwSiCYyWOusd7peiVmtqzDUGAFz0B5k-3MrMvel0C6zbuPG-jh9qCH4J1XWCqlLA96xYDe6tyYPODusjjbrDq1H9p6iFfcJQweKrxUVTxvNodPD-2pYk0SPsTjSCdypENmk1D9xRgHZWeeraoYutK8A_I-5W1xgq9C_8lkWgytxIt71Knd8VQlp9PVD_v6hgFT_ET' },
    { text: 'Sumimasen', spoke: 'すみません', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlBblDePUXp7ynhL-YEsOBH7oDHLWCeRXfSg9FJqkkbdt_0V1ROQ84qJu_hUGix8DgX0CHvkxlO45nPlFkz9hgGU6SKRszgXOoxC5SrOvEdxxPiUL5LgzU8j7W_gUeAujYiUEe6T9YqO1AMsetxHAq861X767P1H__fIHpsZOH9F6I8wDJ2xe0T4QqXzqIWtmrTpA2AHIEMCdT7-FRIqA5ECadvKjXbzzCaifUcWOxa7J2BMWcoe24n2AT969b8NfKCIHuv-ZsOyC8' },
    { text: 'Oshiete', spoke: 'おしえて', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4PdILX3QExdlDXQsg_2Pj--Vr-zTQKN7EMQU9f1cT0-K3FzkzhXS4prhUKKpQt-gRzOpUGaHYc9Z2kXkeO48q0JIUo1LeOOg3I63OUMZfS-6CqVDuoanIjalkhN2nGuOkqSE6u_MtEk0zS6U6HwPAyGJsu4G9E_vTNGkv7seewCR7oCsZgA2ZECR-Ts0iXsYZa9q447k8c0lLjHp5H4my9Ow_X7Hw-qeJXnST77DH3Cl_9_sDHB_EzvJVfhfVrtA8n_nfHttMJpJP' },
  ];

  const handleSelect = (idx: number) => {
    if (status === 'correct' || status === 'incorrect') return;
    audioService.playClick();
    setSelected(idx);
    speechService.speak(options[idx].spoke);
  };

  const handleAction = () => {
    if (status === 'correct') {
      onFinish();
      return;
    }

    if (status === 'incorrect') {
      setStatus('idle');
      setSelected(null);
      return;
    }

    if (selected === 0) {
      setStatus('correct');
      audioService.playSuccess();
    } else {
      setStatus('incorrect');
      audioService.playClick(); // Or a "fail" sound if I had one
      onLoseHeart();
    }
  };

  const handleClose = () => {
    audioService.playClick();
    onClose();
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col px-6 pt-4 h-auto bg-white/90 backdrop-blur-md pb-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-100">
            <X className="w-6 h-6 text-[#514345]" />
          </button>
          <div className="flex-1 mx-6 h-3 bg-pink-100 rounded-full overflow-hidden relative shadow-inner">
            <motion.div 
              initial={{ width: '40%' }}
              animate={{ width: status === 'correct' ? '100%' : '60%' }}
              className="absolute top-0 left-0 h-full bg-primary rounded-full shadow-sm"
            ></motion.div>
          </div>
          <div className="flex items-center gap-1.5 text-primary font-black">
            <Heart className={`w-6 h-6 ${isInfiniteHearts ? 'animate-pulse' : ''} fill-primary`} />
            <span className="text-xl tabular-nums">{isInfiniteHearts ? '∞' : hearts}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 pt-24 pb-32 flex flex-col max-w-lg mx-auto w-full">
        <div className="mt-8 mb-10">
          <h1 className="text-3xl font-black text-[#191c1d] text-center tracking-tight">Which of these means "Thank you"?</h1>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-20 flex-1">
          {options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = idx === 0;
            
            let colorClasses = 'bg-white border-[#e1e3e4] hover:border-primary/50';
            if (isSelected) {
               if (status === 'correct') colorClasses = 'bg-green-50 border-green-500 ring-2 ring-green-100';
               else if (status === 'incorrect') colorClasses = 'bg-red-50 border-red-500 ring-2 ring-red-100';
               else colorClasses = 'bg-primary-container/20 border-primary shadow-md';
            }

            return (
              <motion.button 
                key={idx}
                whileTap={status === 'idle' ? { scale: 0.95 } : {}}
                onClick={() => handleSelect(idx)}
                className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all h-44 shadow-sm relative overflow-hidden ${colorClasses}`}
              >
                <div className="w-20 h-20 mb-3 rounded-full bg-[#f8f9fa] flex items-center justify-center overflow-hidden border border-outline-variant/30">
                  <img 
                    alt={opt.text} 
                    src={opt.image} 
                    className="w-14 h-14 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-xl font-bold text-[#191c1d]">{opt.text}</span>
              </motion.button>
            );
          })}
        </div>
      </main>

      <motion.div 
        initial={false}
        animate={{ 
          backgroundColor: status === 'correct' ? '#d7ffb8' : status === 'incorrect' ? '#ffdfe0' : '#ffffff',
          y: status !== 'idle' ? 0 : 0
        }}
        className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-[#e1e3e4] z-50"
      >
        <div className="max-w-lg mx-auto flex flex-col gap-4">
          {status === 'correct' && (
            <div className="flex items-center gap-4 text-[#58a700] mb-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <p className="font-black text-2xl">Awesome!</p>
                <p className="font-bold">You're getting better!</p>
              </div>
            </div>
          )}
          {status === 'incorrect' && (
            <div className="flex items-center gap-4 text-[#ea2b2b] mb-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-2xl">💔</span>
              </div>
              <div>
                <p className="font-black text-2xl">Not quite...</p>
                <p className="font-bold">The correct answer was "Arigato"</p>
              </div>
            </div>
          )}
          
          <button 
            disabled={selected === null && status === 'idle'}
            onClick={handleAction}
            className={`w-full py-4 rounded-2xl font-black text-lg shadow-[0_4px_0_0_#0000001a] active:shadow-none active:translate-y-1 transition-all uppercase tracking-widest
              ${status === 'correct' ? 'bg-[#58cc02] text-white shadow-[#46a302]' : 
                status === 'incorrect' ? 'bg-[#ff4b4b] text-white shadow-[#d33131]' : 
                selected !== null ? 'bg-primary text-white shadow-[#d4aeb4]' : 'bg-[#e5e5e5] text-[#afafaf] cursor-not-allowed shadow-none active:translate-y-0'}`}
          >
            {status === 'correct' ? 'Next' : status === 'incorrect' ? 'Try Again' : 'Check'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
