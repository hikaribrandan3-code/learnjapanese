/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Trash2, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { Screen } from '../types';
import BottomNav from '../components/BottomNav';
import { audioService } from '../services/audioService';
import { speechService } from '../services/speechService';

interface WritingScreenProps {
  onNavigate: (screen: Screen) => void;
}

const CHARACTERS = [
  { kana: 'あ', romaji: 'a', type: 'Hiragana' },
  { kana: 'い', romaji: 'i', type: 'Hiragana' },
  { kana: 'う', romaji: 'u', type: 'Hiragana' },
  { kana: 'え', romaji: 'e', type: 'Hiragana' },
  { kana: 'お', romaji: 'o', type: 'Hiragana' },
  { kana: '日', romaji: 'nichi', type: 'Kanji', meaning: 'Day/Sun' },
  { kana: '月', romaji: 'tsuki', type: 'Kanji', meaning: 'Month/Moon' },
  { kana: '火', romaji: 'hi', type: 'Kanji', meaning: 'Fire' },
  { kana: '水', romaji: 'mizu', type: 'Kanji', meaning: 'Water' },
  { kana: '猫', romaji: 'neko', type: 'Kanji', meaning: 'Cat' },
  { kana: '犬', romaji: 'inu', type: 'Kanji', meaning: 'Dog' },
];

export default function WritingScreen({ onNavigate }: WritingScreenProps) {
  const [charIndex, setCharIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentChar = CHARACTERS[charIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Initial clear
    clearCanvas();
  }, [charIndex]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath(); // reset path
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#514345';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      audioService.playClick();
    }
  };

  const handleNext = () => {
    audioService.playClick();
    setCharIndex((prev) => (prev + 1) % CHARACTERS.length);
  };

  const handlePrev = () => {
    audioService.playClick();
    setCharIndex((prev) => (prev - 1 + CHARACTERS.length) % CHARACTERS.length);
  };

  const playSound = () => {
    audioService.playClick();
    speechService.speak(currentChar.kana);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans">
      <header className="px-6 pt-12 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#191c1d]">Writing Mode</h1>
          <p className="text-[#837375] font-bold uppercase tracking-wider text-xs">Trace to learn</p>
        </div>
        <button 
          onClick={playSound}
          className="p-3 bg-pink-100 text-pink-500 rounded-2xl hover:scale-110 transition-transform shadow-sm"
        >
          <Volume2 className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center px-6 pb-24">
        {/* Character Info Card */}
        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-sm border border-[#e1e3e4] mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center font-black text-xl">
              {currentChar.kana}
            </div>
            <div>
              <p className="font-black text-[#191c1d]">{currentChar.romaji}</p>
              <p className="text-xs text-[#837375] font-bold uppercase tracking-widest">{currentChar.type} {currentChar.meaning && `• ${currentChar.meaning}`}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrev} className="p-2 text-[#837375] hover:text-primary"><ChevronLeft /></button>
            <button onClick={handleNext} className="p-2 text-[#837375] hover:text-primary"><ChevronRight /></button>
          </div>
        </div>

        {/* Drawing Board */}
        <div className="w-full max-w-md aspect-square bg-white rounded-[40px] shadow-xl border-4 border-pink-100 relative overflow-hidden group">
          {/* Tracing Template (Background Character) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[240px] font-medium text-pink-50 opacity-50">
              {currentChar.kana}
            </span>
          </div>

          {/* Reference Lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-full h-px bg-slate-300"></div>
            <div className="h-full w-px bg-slate-300 absolute"></div>
          </div>

          {/* The Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none"
          />

          {/* Canvas Actions */}
          <div className="absolute bottom-6 right-6 z-20 flex gap-3">
             <button 
              onClick={clearCanvas}
              className="p-4 bg-white/90 backdrop-blur text-primary rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform border border-pink-100"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            <button 
              onClick={clearCanvas}
              className="p-4 bg-primary text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="mt-8 text-center px-8">
          <p className="text-[#837375] font-medium italic">
            "Follow the faint lines to master the stroke order. Practice makes perfect!"
          </p>
        </div>
      </main>

      <BottomNav currentScreen={Screen.WRITING} onNavigate={onNavigate} />
    </div>
  );
}
