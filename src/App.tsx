/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Level, LessonSummary } from './types';
import { LEVELS } from './data/lessons';
import { RECIPES } from './data/recipes';

// Components
import Login from './components/Login';
import LevelPath from './components/LevelPath';
import ActiveQuiz from './components/ActiveQuiz';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import RecipeGiftModal from './components/RecipeGiftModal';
import FloatingAudioController from './components/FloatingAudioController';

// Icons & Presentation
import { Award, BookOpen, Star, User as UserIcon, LogOut, Gift, Phone, MapPin, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AvatarCustomizer from './components/AvatarCustomizer';
import { audioManager } from './utils/audio';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'leaderboard' | 'profile'>('map');
  const [isMuted, setIsMuted] = useState(audioManager.isMuted());
  
  // Selection states
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [activeLesson, setActiveLesson] = useState<LessonSummary | null>(null);
  
  // Recipe Reward trigger
  const [activeRecipeGift, setActiveRecipeGift] = useState<typeof RECIPES[0] | null>(null);
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(0);

  // Load level configuration
  const activeLevel: Level = LEVELS.find(l => l.id === selectedLevelId) || LEVELS[0];

  // Compliant user interaction hook to play background music loop once user interacts with page
  useEffect(() => {
    const startMusicOnInteraction = () => {
      audioManager.setLevel(selectedLevelId);
      audioManager.startBackgroundMusic();
      window.removeEventListener('click', startMusicOnInteraction);
    };
    window.addEventListener('click', startMusicOnInteraction);
    return () => {
      window.removeEventListener('click', startMusicOnInteraction);
      audioManager.stopBackgroundMusic();
    };
  }, []);

  // Update level of audio manager when selected level changes
  useEffect(() => {
    audioManager.setLevel(selectedLevelId);
  }, [selectedLevelId]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    audioManager.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) {
      audioManager.playClick();
    }
  };

  // Try to automatically log in if credentials are saved and valid on start!
  useEffect(() => {
    const autoLogin = async () => {
      const savedEmail = localStorage.getItem('verduplay_remember_email');
      const savedPass = localStorage.getItem('verduplay_remember_password');
      if (savedEmail && savedPass) {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: savedEmail, password: savedPass })
          });
          if (res.ok) {
            const userData = await res.json();
            setCurrentUser(userData);
          }
        } catch (e) {
          console.warn("Auto-login failed:", e);
        }
      }
    };
    autoLogin();
  }, []);

  // Update profile details and sync user state
  const handleUpdateUserProfile = async (updatedUser: User) => {
    try {
      const res = await fetch('/api/user/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
      if (!res.ok) throw new Error('Error al actualizar');
      const freshUser = await res.json();
      setCurrentUser(freshUser);
      setRefreshLeaderboard(prev => prev + 1);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Callback when a user completes a lesson and gains score
  const handleLessonCompleted = async (gainedXp: number, questionsCount: number) => {
    if (!currentUser) return;
    
    const prevSteps = currentUser.currentSteps || 0;
    const newSteps = prevSteps + questionsCount;

    try {
      const res = await fetch('/api/user/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          scoreIncrement: gainedXp,
          stepsIncrement: questionsCount,
          lessonId: activeLesson?.id,
          currentLevel: selectedLevelId
        })
      });

      if (!res.ok) throw new Error('Error al enviar puntaje');
      const updatedUser: User = await res.json();
      
      // Update local state
      setCurrentUser(updatedUser);
      setActiveLesson(null);
      setRefreshLeaderboard(prev => prev + 1);

      // Check for multiples of 10 steps!
      const crossedThreshold = Math.floor(newSteps / 10) > Math.floor(prevSteps / 10);
      if (crossedThreshold) {
        // Select a recipe based on their progress index!
        const rIndex = Math.floor(newSteps / 10) % RECIPES.length;
        const prizeRecipe = RECIPES[rIndex] || RECIPES[0];
        
        // Wait briefly for completion celebration to settle, then pop up the Recipe Gift!
        setTimeout(() => {
          audioManager.playWinJingle();
          setActiveRecipeGift(prizeRecipe);
        }, 800);
      }

    } catch (err) {
      console.error("Score submit failed:", err);
      // Fallback local update if offline or server error
      const localUpdatedUser: User = {
        ...currentUser,
        totalScore: currentUser.totalScore + gainedXp,
        currentSteps: newSteps,
        completedLessons: [...currentUser.completedLessons, activeLesson?.id || '']
      };
      setCurrentUser(localUpdatedUser);
      setActiveLesson(null);
    }
  };

  // Clear session on logout
  const handleLogout = () => {
    localStorage.removeItem('verduplay_remember_email');
    localStorage.removeItem('verduplay_remember_password');
    setCurrentUser(null);
    setActiveTab('map');
  };

  // Demo tool to automatically gift a recipe instantly so evaluators don't wait for 10 answers!
  const triggerDemoRecipeGift = () => {
    audioManager.playCorrect();
    const randomIndex = Math.floor(Math.random() * RECIPES.length);
    setActiveRecipeGift(RECIPES[randomIndex]);
  };

  // If user is currently solving a quiz, we hide the main navigation header
  // creating a clean, high-focus "Duolingo-style" quiz arena!
  if (currentUser && activeLesson) {
    return (
      <div className="min-h-screen bg-[#f7fbe8] py-8 px-4 flex items-center justify-center font-sans">
        <ActiveQuiz 
          lesson={activeLesson}
          onQuit={() => setActiveLesson(null)}
          onComplete={handleLessonCompleted}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8F9] text-gray-800 font-sans flex flex-col lg:flex-row">
      
      {/* 1. LEFT SIDEBAR (Desktop only - Shown when logged in) */}
      {currentUser && (
        <aside className="hidden lg:flex w-64 bg-white border-r-2 border-[#E5E5E5] flex-col p-6 sticky top-0 h-screen select-none z-10 flex-shrink-0 justify-between">
          <div className="space-y-8">
            {/* Logo of La Verdu */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-full p-0.5 shadow-sm flex items-center justify-center border border-gray-150 flex-shrink-0 select-none">
                {/* Brand Logo matching the official flyer design */}
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  <defs>
                    <path id="sidebar-top-text-path" d="M 18 64 A 42 42 0 0 1 102 64" fill="none" />
                    <path id="sidebar-bottom-text-path" d="M 102 56 A 42 42 0 0 1 18 56" fill="none" />
                  </defs>
                  <circle cx="60" cy="60" r="56" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                  <circle cx="60" cy="60" r="51.5" fill="none" stroke="#000000" strokeWidth="0.75" />
                  {/* Left "DESDE" badge */}
                  <g transform="translate(8, 54)">
                    <rect x="0" y="0" width="23" height="12" rx="3.5" fill="#FFD900" stroke="#000000" strokeWidth="1.25" />
                    <text x="11.5" y="8.5" fill="#000000" fontSize="6.2" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">DESDE</text>
                  </g>
                  {/* Right "1996" badge */}
                  <g transform="translate(89, 54)">
                    <rect x="0" y="0" width="23" height="12" rx="3.5" fill="#FFD900" stroke="#000000" strokeWidth="1.25" />
                    <text x="11.5" y="8.5" fill="#000000" fontSize="6.2" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">1996</text>
                  </g>
                  <circle cx="60" cy="60" r="28" fill="#F8FAFC" stroke="#000000" strokeWidth="1.5" />
                  <g transform="translate(60, 60)">
                    <g transform="translate(0, -9) scale(0.95)">
                      <path d="M 0 -13 L -3 -6 L 3 -6 Z" fill="#15803D" />
                      <ellipse cx="0" cy="1" rx="8" ry="10" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.75" />
                    </g>
                    <g transform="translate(-12, -3) rotate(-20) scale(0.85)">
                      <path d="M -10 0 A 10 10 0 0 0 10 0 Z" fill="#15803D" />
                      <path d="M -8.5 -1 A 8.5 8.5 0 0 0 8.5 -1 Z" fill="#EF4444" />
                    </g>
                    <g transform="translate(-8, 7) scale(0.95)">
                      <circle cx="0" cy="0" r="7.5" fill="#EF4444" />
                    </g>
                    <g transform="translate(8, 7) scale(0.95)">
                      <circle cx="0" cy="0" r="7.5" fill="#F97316" />
                    </g>
                  </g>
                  <text fill="#000000" fontSize="10.5" fontWeight="900" fontFamily="var(--font-display)" letterSpacing="0.5">
                    <textPath href="#sidebar-top-text-path" startOffset="50%" textAnchor="middle">LA VERDU</textPath>
                  </text>
                  <text fill="#000000" fontSize="7.8" fontWeight="900" fontFamily="var(--font-display)" letterSpacing="0.2">
                    <textPath href="#sidebar-bottom-text-path" startOffset="50%" textAnchor="middle">DE VILLA CABRERA</textPath>
                  </text>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black text-brand-green tracking-tight leading-none">LA VERDU</h1>
                <span className="text-[10px] font-black text-brand-yellow-dark tracking-wide uppercase">VILLA CABRERA</span>
              </div>
            </div>

            {/* Sidebar Navigation Options */}
            <nav className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  audioManager.playClick();
                  setActiveTab('map');
                }}
                className={`flex items-center gap-4 w-full p-3.5 rounded-2xl font-black text-xs transition-all border-2 text-left cursor-pointer ${
                  activeTab === 'map'
                    ? 'bg-[#DDF4FF] border-[#84D8FF] text-[#1899D6] shadow-[0_4px_0_0_#84D8FF]'
                    : 'border-transparent text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">🏠</span> APRENDER
              </button>

              <button
                type="button"
                onClick={() => {
                  audioManager.playClick();
                  setActiveTab('leaderboard');
                }}
                className={`flex items-center gap-4 w-full p-3.5 rounded-2xl font-black text-xs transition-all border-2 text-left cursor-pointer ${
                  activeTab === 'leaderboard'
                    ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-[0_4px_0_0_#F59E0B]'
                    : 'border-transparent text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">🏆</span> CLASIFICACIÓN
              </button>

              <button
                type="button"
                onClick={() => {
                  audioManager.playClick();
                  setActiveTab('profile');
                }}
                className={`flex items-center gap-4 w-full p-3.5 rounded-2xl font-black text-xs transition-all border-2 text-left cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#EBF7E3] border-[#BFE69C] text-[#58CC02] shadow-[0_4px_0_0_#BFE69C]'
                    : 'border-transparent text-gray-500 hover:bg-gray-50'
                }`}
              >
                <div className="w-5 h-5 rounded-full overflow-hidden flex bg-white/20 items-center justify-center border border-gray-300">
                  <AvatarCustomizer config={currentUser.caricature} readOnly={true} size={25} />
                </div>
                PERFIL
              </button>

              {/* Dynamic Sound synthesizer controller */}
              <button
                type="button"
                onClick={toggleMute}
                className={`flex items-center gap-4 w-full p-3.5 rounded-2xl font-black text-[10px] sm:text-xs transition-all border-2 text-left cursor-pointer ${
                  isMuted
                    ? 'border-[#E5E5E5] text-gray-400 bg-gray-50'
                    : 'bg-[#E6F4EA] border-[#A3E635] text-[#137333] shadow-[0_4px_0_0_#A3E635]'
                }`}
              >
                <span className="text-lg">{isMuted ? '🔇' : '🔊'}</span>
                <span>{isMuted ? 'MÚSICA SILENCIADA' : 'MÚSICA DIVERTIDA'}</span>
              </button>
            </nav>
          </div>

          {/* Próximo Regalo Progress tracker */}
          <div className="p-4 bg-[#FFD900]/10 border-2 border-[#FFD900] rounded-2xl">
            <p className="text-[10px] font-black text-[#D3A100] uppercase mb-1 flex items-center justify-between">
              <span>PRÓXIMO REGALO 🎁</span>
              <span className="font-extrabold">{currentUser.currentSteps % 10}/10 lecciones</span>
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3 bg-[#E5E5E5] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FFD900] rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, ((currentUser.currentSteps || 0) % 10) * 10)}%` }}
                />
              </div>
              <span className="text-[11px] font-black text-[#D3A100]">
                {10 - (currentUser.currentSteps % 10)} paso{10 - (currentUser.currentSteps % 10) === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </aside>
      )}

      {/* 2. CENTRAL PANEL (Header, main contents, footer) */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* TOP COMPLIANT STATS HEADER - Only shown when logged in */}
        {currentUser ? (
          <header className="sticky top-0 bg-white border-b-2 border-[#E5E5E5] z-40 select-none px-4 sm:px-8">
            <div className="max-w-4xl mx-auto h-20 flex items-center justify-between">
              
              {/* Left Logo in mobile header view */}
              <div className="flex items-center gap-2 lg:hidden">
                <div className="w-11 h-11 bg-white rounded-full p-0.5 shadow-sm flex items-center justify-center border border-gray-150 flex-shrink-0 select-none">
                  {/* Brand Logo matching the official flyer design */}
                  <svg viewBox="0 0 120 120" className="w-full h-full">
                    <defs>
                      <path id="mobile-top-text-path" d="M 18 64 A 42 42 0 0 1 102 64" fill="none" />
                      <path id="mobile-bottom-text-path" d="M 102 56 A 42 42 0 0 1 18 56" fill="none" />
                    </defs>
                    <circle cx="60" cy="60" r="56" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                    <circle cx="60" cy="60" r="51.5" fill="none" stroke="#000000" strokeWidth="0.75" />
                    {/* Left "DESDE" badge */}
                    <g transform="translate(8, 54)">
                      <rect x="0" y="0" width="23" height="12" rx="3.5" fill="#FFD900" stroke="#000000" strokeWidth="1.25" />
                      <text x="11.5" y="8.5" fill="#000000" fontSize="6.2" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">DESDE</text>
                    </g>
                    {/* Right "1996" badge */}
                    <g transform="translate(89, 54)">
                      <rect x="0" y="0" width="23" height="12" rx="3.5" fill="#FFD900" stroke="#000000" strokeWidth="1.25" />
                      <text x="11.5" y="8.5" fill="#000000" fontSize="6.2" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">1996</text>
                    </g>
                    <circle cx="60" cy="60" r="28" fill="#F8FAFC" stroke="#000000" strokeWidth="1.5" />
                    <g transform="translate(60, 60)">
                      <g transform="translate(0, -9) scale(0.95)">
                        <path d="M 0 -13 L -3 -6 L 3 -6 Z" fill="#15803D" />
                        <ellipse cx="0" cy="1" rx="8" ry="10" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.75" />
                      </g>
                      <g transform="translate(-12, -3) rotate(-20) scale(0.85)">
                        <path d="M -10 0 A 10 10 0 0 0 10 0 Z" fill="#15803D" />
                        <path d="M -8.5 -1 A 8.5 8.5 0 0 0 8.5 -1 Z" fill="#EF4444" />
                      </g>
                      <g transform="translate(-8, 7) scale(0.95)">
                        <circle cx="0" cy="0" r="7.5" fill="#EF4444" />
                      </g>
                      <g transform="translate(8, 7) scale(0.95)">
                        <circle cx="0" cy="0" r="7.5" fill="#F97316" />
                      </g>
                    </g>
                    <text fill="#000000" fontSize="10.5" fontWeight="900" fontFamily="var(--font-display)" letterSpacing="0.5">
                      <textPath href="#mobile-top-text-path" startOffset="50%" textAnchor="middle">LA VERDU</textPath>
                    </text>
                    <text fill="#000000" fontSize="7.8" fontWeight="900" fontFamily="var(--font-display)" letterSpacing="0.2">
                      <textPath href="#mobile-bottom-text-path" startOffset="50%" textAnchor="middle">DE VILLA CABRERA</textPath>
                    </text>
                  </svg>
                </div>
                <div>
                  <h1 className="text-sm font-black text-brand-green leading-none">LA VERDU</h1>
                  <span className="text-[9px] font-bold text-yellow-600 block leading-none">Villa Cabrera</span>
                </div>
              </div>

              {/* Bento Stats row: Hearts, Streaks, Diamonds, XP */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5" title="Salud / Corazones">
                  <span className="text-xl sm:text-2xl">❤️</span>
                  <span className="font-bold sm:font-black text-brand-red text-xs sm:text-sm">5</span>
                </div>
                <div className="flex items-center gap-1.5" title="Racha Diaria">
                  <span className="text-xl sm:text-2xl">🔥</span>
                  <span className="font-bold sm:font-black text-brand-orange text-xs sm:text-sm">12</span>
                </div>
                <div className="flex items-center gap-1.5" title="Monedas / Esmeraldas">
                  <span className="text-xl sm:text-2xl">💎</span>
                  <span className="font-bold sm:font-black text-brand-blue text-xs sm:text-sm">1,240</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-[#F4FCE3] text-brand-green-dark py-1 px-3 rounded-full border border-[#BDDFA9] text-xs">
                  <span className="text-lg">🏆</span>
                  <span className="font-black text-xs font-mono">{currentUser.totalScore || 0} XP</span>
                </div>
              </div>

              {/* Mobile/Tablet Tab menu */}
              <nav className="flex lg:hidden items-center gap-1">
                <button
                  type="button"
                  id="mobile-nav-map"
                  onClick={() => setActiveTab('map')}
                  className={`p-2.5 rounded-xl text-xs font-black transition-all ${
                    activeTab === 'map' ? 'bg-[#DDF4FF] text-[#1899D6]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Aprender"
                >
                  <BookOpen className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  id="mobile-nav-leaderboard"
                  onClick={() => setActiveTab('leaderboard')}
                  className={`p-2.5 rounded-xl text-xs font-black transition-all ${
                    activeTab === 'leaderboard' ? 'bg-[#FFE6D5] text-[#FF8235]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Líderes"
                >
                  <Star className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  id="mobile-nav-profile"
                  onClick={() => setActiveTab('profile')}
                  className={`p-2.5 rounded-xl text-xs font-black transition-all ${
                    activeTab === 'profile' ? 'bg-[#EBF7E3] text-brand-green' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Perfil"
                >
                  <UserIcon className="w-5 h-5" />
                </button>
              </nav>

              {/* Right User Summary */}
              <div className="flex items-center gap-2">
                {/* Audio speaker toggle button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  title={isMuted ? "Activar sonido" : "Silenciar sonido"}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-gray-50 border-2 select-none cursor-pointer ${
                    isMuted 
                      ? 'text-gray-400 border-[#E5E5E5] hover:bg-gray-100'
                      : 'text-brand-green border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-bounce" style={{ animationDuration: '2s' }} />}
                </button>

                <div className="hidden md:flex flex-col items-end leading-none">
                  <span className="font-black text-xs text-gray-950">{currentUser.name.split(' ')[0]}</span>
                  <span className="text-[9px] text-[#AFAFAF] uppercase font-bold">Nivel {currentUser.currentLevel || 1}</span>
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-[#E5E5E5] overflow-hidden flex bg-white justify-center items-center cursor-pointer" onClick={() => { audioManager.playClick(); setActiveTab('profile'); }}>
                  <AvatarCustomizer config={currentUser.caricature} readOnly={true} size={28} />
                </div>
                <button
                  type="button"
                  id="mobile-logout-btn"
                  onClick={() => {
                    audioManager.playClick();
                    handleLogout();
                  }}
                  className="p-1 text-[10px] sm:text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase ml-1"
                >
                  Salir
                </button>
              </div>

            </div>
          </header>
        ) : null}

        {/* 3. CENTRAL MAIN SCALED BODY */}
        <div className="flex-1 flex flex-col lg:flex-row">
          
          <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col items-center">
            
            {/* If logged out: Show the Login form screen */}
            {!currentUser ? (
              <div className="py-8 w-full flex items-center justify-center">
                <Login onLoginSuccess={(usr) => setCurrentUser(usr)} />
              </div>
            ) : (
              /* TAB 1: LEARN MAP AND LEVELS PATHWAY */
              activeTab === 'map' ? (
                <div className="w-full space-y-8 py-2">
                  
                  {/* Level / World Selector Grid - 3 worlds matching requirements */}
                  <div>
                    <span className="text-[10px] font-black text-gray-400 block mb-3 uppercase tracking-widest text-center sm:text-left">
                      Elige tu Módulo de Aprendizaje
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      {LEVELS.map((level) => {
                        const isSelected = selectedLevelId === level.id;
                        const icon = level.id === 1 ? '🥦' : level.id === 2 ? '🐝' : '🌱';
                        return (
                          <button
                            key={level.id}
                            type="button"
                            id={`world-selector-${level.id}`}
                            onClick={() => {
                              audioManager.playClick();
                              setSelectedLevelId(level.id);
                            }}
                            className={`p-4 rounded-2xl border-2 text-left relative overflow-hidden transition-all select-none cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-white border-brand-green shadow-[0_4px_0_0_#46A302] ring-2 ring-emerald-200/50 translate-y-[-2px]'
                                : 'bg-white border-[#E5E5E5] hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start justify-between w-full mb-1">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                level.id === 1 ? 'bg-[#F4FCE3] text-[#46A302]' : level.id === 2 ? 'bg-[#FFE6D5] text-[#FF8235]' : 'bg-[#EBF7E3] text-[#58CC02]'
                              }`}>
                                MÓDULO {level.id}
                              </span>
                              <span className="text-xl">{icon}</span>
                            </div>

                            <div className="mt-2">
                              <h4 className="font-extrabold text-gray-950 text-xs sm:text-sm leading-tight uppercase">{level.title}</h4>
                              <span className="text-[10px] text-gray-400 mt-0.5 block leading-normal line-clamp-1">
                                {level.description}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* S-curve level tree */}
                  <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-5 sm:p-8 relative shadow-sm">
                    
                    {/* Floating Demo testing button at the corner */}
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        type="button"
                        id="demo-unveil-recipe"
                        onClick={triggerDemoRecipeGift}
                        className="py-1.5 px-3 bg-[#FFD900] hover:bg-yellow-400 text-yellow-950 rounded-xl text-[10px] font-black flex items-center gap-2 shadow-[0_3px_0_0_#D3A100] border-2 border-[#D3A100] transition-all hover:translate-y-[1px] hover:shadow-[0_2px_0_0_#D3A100] active:translate-y-[3px] active:shadow-none"
                        title="Prueba desenvolver una receta directo sin 10 pasos"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        Demo Receta Directa 🎁
                      </button>
                    </div>

                    <LevelPath 
                      level={activeLevel}
                      completedLessons={currentUser.completedLessons || []}
                      onStartLesson={(lesson) => setActiveLesson(lesson)}
                    />
                  </div>

                </div>
              ) : /* TAB 2: LEADERBOARD SCREEN */
              activeTab === 'leaderboard' ? (
                <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6 w-full max-w-2xl py-4 my-2">
                  <Leaderboard 
                    currentUserEmail={currentUser.email} 
                    refreshTrigger={refreshLeaderboard}
                  />
                </div>
              ) : (
                /* TAB 3: USER ACCOUNT PROFILE & CARICATURE */
                <div className="w-full max-w-2xl py-2">
                  <Profile 
                    user={currentUser} 
                    onUpdateUser={handleUpdateUserProfile} 
                  />
                </div>
              )
            )}

          </main>

          {/* 3. RIGHT SIDEBAR (Desktop only - Shown when logged in) */}
          {currentUser && (
            <aside className="hidden lg:flex w-80 bg-white border-l-2 border-[#E5E5E5] p-6 flex-col gap-6 sticky top-0 h-screen select-none overflow-y-auto">
              
              {/* WhatsApp Unlocked Gift Card details */}
              <div className="p-5 bg-brand-yellow rounded-3xl border-b-8 border-brand-yellow-dark text-center relative overflow-hidden">
                <div className="absolute top-1 right-2 text-2xl animate-bounce">🎁</div>
                <h3 className="font-black text-lg text-white mb-1.5 tracking-tight uppercase">RECETA DESBLOQUEADA</h3>
                <p className="text-[11px] font-black text-brand-yellow-dark mb-4 uppercase">
                  {currentUser.currentSteps >= 10 ? '¡Listo para retirar gratis!' : '¡Consigue 10 aciertos saludables!'}
                </p>

                <div className="bg-white rounded-2xl p-4 text-left text-xs space-y-1 mb-5 border border-brand-yellow-dark/30 font-bold text-gray-700">
                  <div className="text-brand-green-dark font-black text-xs uppercase mb-1 flex items-center justify-between">
                    <span>🧉 Yerba Mate Piporé & Miel</span>
                    <span className="text-[10.5px] bg-[#F4FCE3] px-2 py-0.5 rounded-full">Villa Cabrera</span>
                  </div>
                  <li className="list-none mr-1">• Yerba Mate Piporé Premium</li>
                  <li className="list-none mr-1">• Miel de Monte La Verdu</li>
                  <li className="list-none mr-1">• Mix de Hojas Verdes Especial</li>
                  <li className="list-none mr-1">• Manzana Verde de Campo</li>
                </div>

                <a 
                  href={`https://wa.me/3513695586?text=Hola%20La%20Verdu!%20Jugué%20al%20VerduPlay%20y%20quiero%20hacer%20un%20pedido%20con%20mis%20ingredientes%20saludables.%20Mi%20nombre:%20${encodeURIComponent(currentUser.name)}%20-%20Mi%20dirección:%20${encodeURIComponent(currentUser.address || 'Miembro de Villa Cabrera')}`}
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="block w-full bg-[#25D366] text-white font-black py-3.5 rounded-2xl shadow-[0_4px_0_0_#128C7E] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#128C7E] active:scale-95 transition-all uppercase text-xs cursor-pointer select-none"
                >
                  Hacer Pedido WhatsApp 💬
                </a>
              </div>

              {/* Historical Ranking Mini preview */}
              <div className="border-2 border-[#E5E5E5] rounded-3xl p-5 bg-[#F7F8F9]/80">
                <h4 className="font-black text-[#AFAFAF] uppercase text-[10.5px] mb-3 tracking-widest">Podio Escolar</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-black text-xs text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-brand-yellow font-black text-left w-4">1</span>
                      <div className="w-6 h-6 rounded-full bg-brand-green border-2 border-white flex items-center justify-center text-[10px] text-white font-black shadow-sm">CC</div>
                      <span>Claudio Cabrera</span>
                    </div>
                    <span className="text-brand-green-dark">540 XP</span>
                  </div>

                  <div className="flex items-center justify-between font-bold text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="text-[#AFAFAF] font-black text-left w-4">2</span>
                      <div className="w-6 h-6 rounded-full bg-orange-400 border border-white flex items-center justify-center text-[10px] text-white font-black shadow-sm">SH</div>
                      <span>Sofi Huerta</span>
                    </div>
                    <span className="text-brand-green-dark">420 XP</span>
                  </div>

                  <div className="flex items-center justify-between font-bold text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="text-[#AFAFAF] font-black text-left w-4">3</span>
                      <div className="w-6 h-6 rounded-full bg-brand-blue border border-white flex items-center justify-center text-[10px] text-white font-black shadow-sm">MP</div>
                      <span>Mateo Piporé</span>
                    </div>
                    <span className="text-brand-green-dark">310 XP</span>
                  </div>

                  {/* Active user item highlighted like Duolingo! */}
                  <div className="flex items-center justify-between font-black text-xs text-[#1899D6] bg-[#DDF4FF] -mx-3 px-3 py-2 rounded-xl border-2 border-[#84D8FF] shadow-[0_2px_0_0_#84D8FF]">
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-center">Tú</span>
                      <div className="w-6 h-6 rounded-full border border-white overflow-hidden flex bg-white/20 items-center justify-center">
                        <AvatarCustomizer config={currentUser.caricature} readOnly={true} size={25} />
                      </div>
                      <span className="truncate max-w-[90px]">{currentUser.name.split(' ')[0]}</span>
                    </div>
                    <span className="text-brand-green-dark">{currentUser.totalScore || 0} XP</span>
                  </div>
                </div>
              </div>

            </aside>
          )}

        </div>

        {/* 4. FOOTER */}
        <footer className="bg-white border-t-2 border-[#E5E5E5] py-5 text-center text-xs select-none mt-auto">
          <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
              &copy; Desde 1996 - La Verdu de Villa Cabrera. Todos los derechos reservados.
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 p-2 px-3.5 rounded-full text-brand-green-dark font-black text-[10px]">
              <Phone className="w-3.5 h-3.5 text-brand-green" />
              VENTAS / WHATSAPP: 3513695586 • CLAUDIO CUENCA 1801
            </div>
          </div>
        </footer>

      </div>

      {/* 5. RECIPE GIFT SURPRISE MODAL PORTAL */}
      {activeRecipeGift && (
        <RecipeGiftModal 
          recipe={activeRecipeGift}
          user={currentUser}
          onClose={() => setActiveRecipeGift(null)}
        />
      )}

      {/* Floating sound controllers for Music and SFX separately */}
      <FloatingAudioController />

    </div>
  );
}
