/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Level, LessonSummary } from '../types';
import { Lock, Check, Play, Award, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import DiegoMascot from './DiegoMascot';
import { audioManager } from '../utils/audio';

interface LevelPathProps {
  level: Level;
  completedLessons: string[];
  onStartLesson: (lesson: LessonSummary) => void;
}

export default function LevelPath({ level, completedLessons, onStartLesson }: LevelPathProps) {
  const [selectedLesson, setSelectedLesson] = useState<LessonSummary | null>(null);

  // Helper to check if a lesson is completed, current, or locked
  const getLessonStatus = (lessonId: string, index: number) => {
    const isCompleted = completedLessons.includes(lessonId);
    
    // First lesson in the whole app is always unlocked, or if previous lesson in this levels list is completed.
    let isUnlocked = false;
    if (index === 0) {
      isUnlocked = true;
    } else {
      const prevLessonId = level.lessons[index - 1].id;
      isUnlocked = completedLessons.includes(prevLessonId);
    }

    return { isCompleted, isUnlocked, isCurrent: isUnlocked && !isCompleted };
  };

  const getPositionClass = (index: number) => {
    // Generate S-curve left-center-right coordinates to simulate Duolingo paths
    const mod = index % 4;
    if (mod === 0) return 'translate-x-[15px] sm:translate-x-[30px]';
    if (mod === 1) return 'translate-x-[45px] sm:translate-x-[80px]';
    if (mod === 2) return 'translate-x-[15px] sm:translate-x-[30px]';
    return 'translate-x-[-15px] sm:translate-x-[-20px]';
  };

  const getAccentColorStyle = (accent: string) => {
    switch (accent) {
      case 'amber': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'lime': return 'bg-lime-100 text-lime-800 border-lime-300';
      case 'emerald':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="flex flex-col items-center py-6 relative">
      {/* Level Header Info */}
      <div className={`w-full max-w-md p-5 rounded-3xl text-white border-2 border-b-8 transition-all ${
        level.id === 1 
          ? 'bg-brand-green border-brand-green-dark shadow-[0_4px_0_0_#46A302]' 
          : level.id === 2 
          ? 'bg-brand-orange border-[#CC7800] shadow-[0_4px_0_0_#CC7800]' 
          : 'bg-brand-blue border-brand-blue-dark shadow-[0_4px_0_0_#1899D6]'
      } mb-10`}>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold bg-black/15 px-2.5 py-1 rounded-full">
              Módulo {level.id}
            </span>
            <h2 className="text-lg sm:text-xl font-black mt-2 leading-tight uppercase font-display">{level.title}</h2>
            <p className="text-xs text-white/95 mt-1 font-semibold">{level.description}</p>
          </div>
          <div className="text-3xl">
            {level.id === 1 ? '🥦' : level.id === 2 ? '🐝' : '🌱'}
          </div>
        </div>
      </div>

      {/* S-curve Path Map Container */}
      <div className="relative flex flex-col items-center w-full max-w-sm min-h-[420px]">
        {/* Draw a dotted curve line in background */}
        <div className="absolute left-[50%] top-6 bottom-16 w-1 border-l-4 border-dashed border-[#E5E5E5] -translate-x-[50%] -z-10" />

        {level.lessons.map((lesson, index) => {
          const { isCompleted, isUnlocked, isCurrent } = getLessonStatus(lesson.id, index);
          const posClass = getPositionClass(index);

          return (
            <div 
              key={lesson.id} 
              className={`flex flex-col items-center mb-10 relative transition-transform ${posClass}`}
            >
              {/* CURRENT STEP FLOATING MASCOT MINI ICON */}
              {isCurrent && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="bg-brand-yellow text-brand-yellow-dark text-[10px] font-black px-2.5 py-1 rounded-full shadow-md border-2 border-white flex items-center gap-1 uppercase tracking-wide"
                  >
                    <span>¡Listo!</span>
                  </motion.div>
                </div>
              )}

              {/* Lesson Node Circle */}
              <motion.button
                whileHover={isUnlocked ? { scale: 1.08 } : {}}
                whileTap={isUnlocked ? { scale: 0.94 } : {}}
                onClick={() => {
                  if (isUnlocked) {
                    audioManager.playClick();
                    setSelectedLesson(lesson);
                  }
                }}
                className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 transition-all relative outline-none cursor-pointer ${
                  isCompleted
                    ? 'bg-brand-green hover:bg-[#62e402] border-brand-green-dark text-white shadow-[0_6px_0_0_#46A302]'
                    : isCurrent
                    ? 'bg-[#FFD900] hover:bg-[#ffe133] border-[#D3A100] text-white shadow-[0_6px_0_0_#D3A100] animate-pulse'
                    : 'bg-[#E5E5E5] border-[#AFAFAF] text-[#AFAFAF] shadow-[0_6px_0_0_#AFAFAF] cursor-not-allowed'
                }`}
                disabled={!isUnlocked}
                id={`lesson-node-${lesson.id}`}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 sm:w-8 sm:h-8 stroke-[3]" />
                ) : isCurrent ? (
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current stroke-none ml-1" />
                ) : (
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                )}
                
                {/* Visual Circle Progress ring around unlocked node */}
                {isUnlocked && (
                  <span className="absolute -bottom-1 -right-1 bg-white text-[10px] font-black text-gray-500 rounded-full w-5 h-5 flex items-center justify-center border border-gray-200">
                    {index + 1}
                  </span>
                )}
              </motion.button>

              {/* Lesson label text floating next to node */}
              <div className="mt-2 text-center max-w-[120px]">
                <span className={`text-xs font-black leading-tight block uppercase tracking-wide ${
                  isUnlocked ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {lesson.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* START LESSON MODAL WITH DIEGO WELCOMING */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-4 border-emerald-400"
          >
            {/* Mascot Greeting Area */}
            <div className="bg-emerald-50 p-6 border-b border-gray-100 flex flex-col items-center text-center">
              <DiegoMascot 
                mood="teaching" 
                size={110} 
                bubbleText={`¡Hola! En esta lección aprenderemos sobre "${selectedLesson.title}".`} 
                bubblePosition="top"
              />
            </div>

            {/* Lesson details */}
            <div className="p-6">
              <h3 className="text-xl font-black text-gray-850 text-center leading-tight">
                {selectedLesson.title}
              </h3>
              <p className="text-sm text-gray-600 text-center mt-2 px-2">
                {selectedLesson.description}
              </p>

              {/* Rewards */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <span className={`text-xs font-extrabold px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 border ${getAccentColorStyle(level.accentColor)}`}>
                  <Award className="w-4 h-4 fill-current" />
                  +{selectedLesson.xpReward} XP de Premio
                </span>
                <span className="text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-300 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  {selectedLesson.questions.length} Preguntas
                </span>
              </div>

              {/* Modal controls */}
              <div className="grid grid-cols-2 gap-3 mt-8">
                <button
                  type="button"
                  id="close-lesson-modal"
                  onClick={() => {
                    audioManager.playClick();
                    setSelectedLesson(null);
                  }}
                  className="py-3 px-4 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-2xl font-bold text-sm transition-all border-b-4 border-gray-300"
                >
                  Volver al Mapa
                </button>
                <button
                  type="button"
                  id="start-lesson-challenge"
                  onClick={() => {
                    audioManager.playClick();
                    const l = selectedLesson;
                    setSelectedLesson(null);
                    onStartLesson(l);
                  }}
                  className="py-3 px-4 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-yellow-950 rounded-2xl font-black text-sm transition-all border-b-4 border-yellow-600"
                >
                  ¡Empezar Desafío!
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
