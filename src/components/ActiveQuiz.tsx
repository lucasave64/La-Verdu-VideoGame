/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QuizQuestion, LessonSummary } from '../types';
import DiegoMascot from './DiegoMascot';
import { Heart, CheckCircle2, XCircle, ArrowUp, ArrowDown, Award, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioManager } from '../utils/audio';

interface ActiveQuizProps {
  lesson: LessonSummary;
  onComplete: (gainedXp: number, answeredCount: number) => void;
  onQuit: () => void;
}

export default function ActiveQuiz({ lesson, onComplete, onQuit }: ActiveQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // For sorting questions, keep local order
  const [sortItems, setSortItems] = useState<string[]>([]);
  
  // Game states
  const [hearts, setHearts] = useState(3);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gainedXp, setGainedXp] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Trigger win or failure sound when showing summary
  React.useEffect(() => {
    if (showSummary) {
      if (hearts > 0) {
        audioManager.playWinJingle();
      } else {
        audioManager.playWrong();
      }
    }
  }, [showSummary, hearts]);

  // Initialize sorting list if needed when currentIdx changes
  const q: QuizQuestion = lesson.questions[currentIdx];
  
  React.useEffect(() => {
    if (q && q.type === 'sorting') {
      // Shuffle slightly or keep options order as start state
      setSortItems([...q.options]);
    }
    setSelectedOption(null);
    setIsAnswered(false);
  }, [currentIdx, q]);

  if (!q) return null;

  // Handler to move sorting items up or down
  const moveSortItem = (index: number, direction: 'up' | 'down') => {
    if (isAnswered) return;
    audioManager.playClick();
    const newItems = [...sortItems];
    if (direction === 'up' && index > 0) {
      const temp = newItems[index];
      newItems[index] = newItems[index - 1];
      newItems[index - 1] = temp;
    } else if (direction === 'down' && index < newItems.length - 1) {
      const temp = newItems[index];
      newItems[index] = newItems[index + 1];
      newItems[index + 1] = temp;
    }
    setSortItems(newItems);
  };

  const handleCheckAnswer = () => {
    if (isAnswered) return;

    let correct = false;
    if (q.type === 'sorting') {
      const correctSeq = q.correctAnswer as string[];
      correct = JSON.stringify(sortItems) === JSON.stringify(correctSeq);
    } else {
      correct = selectedOption === q.correctAnswer;
    }

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      audioManager.playCorrect();
      setGainedXp(prev => prev + q.rewardExp);
    } else {
      audioManager.playWrong();
      setHearts(prev => Math.max(0, prev - 1));
    }
  };

  const handleNextStep = () => {
    audioManager.playClick();
    if (currentIdx < lesson.questions.length - 1 && hearts > 0) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Completed or failed
      setShowSummary(true);
    }
  };

  const handleFinish = () => {
    audioManager.playClick();
    onComplete(gainedXp + (hearts > 0 ? lesson.xpReward : 20), lesson.questions.length);
  };

  // Render the result summary at the end
  if (showSummary) {
    const isSuccess = hearts > 0;
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-emerald-100 p-6 text-center text-sm">
        
        <DiegoMascot 
          mood={isSuccess ? 'happy' : 'sad'} 
          size={120} 
          bubbleText={isSuccess ? '¡Excelente trabajo hoy!' : '¡Oops! Nos quedamos sin corazones de energía.'}
          bubblePosition="top"
          className="justify-center mb-6"
        />

        <h3 className="text-2xl font-black text-gray-800 leading-tight">
          {isSuccess ? '¡Desafío Completado!' : '¡Inténtalo de Nuevo!'}
        </h3>
        
        <p className="text-gray-500 mt-2">
          {isSuccess 
            ? `Aprendiste valiosos secretos saludables con La Verdu y obtuviste excelentes resultados.` 
            : `¡No te desanimes! En La Verdu amamos guiar a nuestra vecindad hacia hábitos alimenticios más sabios.`}
        </p>

        {/* Score display block */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5 mt-6 grid grid-cols-2 gap-4">
          <div className="text-center">
            <span className="text-xs font-bold text-gray-400 block uppercase">Puntaje Ganado</span>
            <span className="text-3xl font-extrabold text-emerald-600 font-mono flex items-center justify-center gap-1">
              <Award className="w-6 h-6 text-yellow-400 fill-current" />
              +{gainedXp + (isSuccess ? lesson.xpReward : 20)}
            </span>
            <span className="text-[10px] text-emerald-800 font-semibold uppercase">Puntos XP</span>
          </div>

          <div className="text-center border-l border-emerald-100 pl-4">
            <span className="text-xs font-bold text-gray-400 block uppercase">Vidas Restantes</span>
            <div className="flex items-center justify-center gap-1 mt-1">
              {[...Array(3)].map((_, i) => (
                <Heart 
                  key={i} 
                  className={`w-6 h-6 ${i < hearts ? 'text-red-500 fill-red-500 animate-pulse' : 'text-gray-200'}`} 
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-500 block mt-1">
              {isSuccess ? '¡Saludable!' : 'Agotado'}
            </span>
          </div>
        </div>

        <button
          type="button"
          id="finish-quiz-btn"
          onClick={handleFinish}
          className="w-full mt-8 py-3.5 px-4 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-yellow-950 font-black rounded-2xl shadow-md border-b-4 border-yellow-600 active:scale-98 transition-all"
        >
          {isSuccess ? '¡Recibir Recompensa!' : 'Volver al Mapa'}
        </button>
      </div>
    );
  }

  // Calculate percentage progress index bar
  const progressPercent = ((currentIdx) / lesson.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-emerald-100 min-h-[520px] flex flex-col justify-between text-sm">
      
      {/* Top Header progress and status bar */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
        {/* Quit button */}
        <button 
          onClick={onQuit}
          id="quit-quiz-cross"
          className="text-gray-400 hover:text-gray-600 font-bold text-base px-2 py-1 select-none"
        >
          ✕
        </button>

        {/* Progress bar */}
        <div className="flex-1 bg-gray-100 h-4 rounded-full overflow-hidden border border-gray-200 p-0.5">
          <div 
            className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Heart indicators */}
        <div className="flex items-center gap-1 select-none flex-shrink-0">
          {[...Array(3)].map((_, i) => (
            <Heart 
              key={i} 
              className={`w-5 h-5 transition-transform duration-300 ${
                i < hearts ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-300'
              }`} 
            />
          ))}
        </div>
      </div>

      {/* Main interactive body */}
      <div className="p-6 flex-1 flex flex-col justify-center">
        
        {/* Diego Mascot Panel providing question contexts */}
        <div className="mb-6 flex justify-start items-center">
          <DiegoMascot 
            mood={isAnswered ? (isCorrect ? 'happy' : 'sad') : 'neutral'} 
            size={80} 
            bubbleText={isAnswered ? (isCorrect ? '¡Excelente deducción!' : '¡Oh, no te preocupes!') : 'Lee con atención, ¡cada acierto nos suma salud!'}
            bubblePosition="right"
          />
        </div>

        {/* Question sentence */}
        <h3 className="text-lg font-extrabold text-gray-800 leading-tight mb-5" id="quiz-question-text">
          {q.questionText}
        </h3>

        {/* Question Options UI block */}
        <div className="space-y-2.5">
          {/* MULTIPLE CHOICE & TRUE FALSE */}
          {q.type !== 'sorting' ? (
            q.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isOptionCorrect = opt === q.correctAnswer;
              
              let cardStyle = 'border-2 border-b-6 border-[#E5E5E5] bg-white text-gray-700 shadow-[0_4px_0_0_#E5E5E5] active:translate-y-[2px] active:shadow-none';
              if (isAnswered) {
                if (isSelected) {
                  cardStyle = isCorrect 
                    ? 'border-2 border-b-6 border-[#46A302] bg-[#E8F8D8] text-[#328001] shadow-[0_4px_0_0_#46A302]' 
                    : 'border-2 border-b-6 border-brand-red bg-[#FEE9E9] text-brand-red shadow-[0_4px_0_0_#CC2222]';
                } else if (isOptionCorrect) {
                  cardStyle = 'border-2 border-b-6 border-[#46A302] bg-[#E8F8D8] text-[#328001] shadow-[0_4px_0_0_#46A302]';
                } else {
                  cardStyle = 'opacity-50 border-2 border-[#E5E5E5] bg-[#F7F8F9] text-gray-400 shadow-none';
                }
              } else if (isSelected) {
                cardStyle = 'border-2 border-b-6 border-brand-blue-dark bg-[#E0F6FF] text-[#1899D6] scale-[1.01] shadow-[0_4px_0_0_#1899D6]';
              }

              return (
                <button
                  key={opt + i}
                  type="button"
                  id={`quiz-option-${i}`}
                  disabled={isAnswered}
                  onClick={() => {
                    audioManager.playClick();
                    setSelectedOption(opt);
                  }}
                  className={`w-full p-3.5 rounded-2xl text-left font-black transition-all flex items-center justify-between text-xs sm:text-sm cursor-pointer select-none ${cardStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isOptionCorrect && <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-brand-red flex-shrink-0" />}
                </button>
              );
            })
          ) : (
            /* SORTING QUESTION ELEMENT */
            <div className="space-y-2">
              <span className="text-[11px] text-gray-400 font-extrabold uppercase block mb-1">Ordena de menor a mayor contenido calórico:</span>
              {sortItems.map((opt, i) => (
                <div
                  key={opt + i}
                  className={`p-3 rounded-2xl border-2 ${
                    isAnswered 
                      ? isCorrect 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900' 
                        : 'border-red-300 bg-red-50 text-red-955'
                      : 'border-gray-200 bg-white text-gray-75 *:'
                  } flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-100 text-slate-500 font-black rounded-lg w-6 h-6 flex items-center justify-center text-xs">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-xs sm:text-sm">{opt}</span>
                  </div>

                  {/* Ordering arrows */}
                  {!isAnswered && (
                    <div className="flex items-center gap-1 select-none">
                      <button
                        type="button"
                        onClick={() => moveSortItem(i, 'up')}
                        disabled={i === 0}
                        className="p-1 rounded-md hover:bg-gray-150 disabled:opacity-30 text-gray-500"
                        title="Subir"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSortItem(i, 'down')}
                        disabled={i === sortItems.length - 1}
                        className="p-1 rounded-md hover:bg-gray-150 disabled:opacity-30 text-gray-500"
                        title="Bajar"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Persistent Bottom Check/Feedback block */}
      <div className={`p-4 border-t border-gray-100 transition-colors duration-300 ${
        isAnswered 
          ? isCorrect 
            ? 'bg-emerald-50 border-emerald-200' 
            : 'bg-red-50 border-red-200' 
          : 'bg-white'
      }`}>
        <AnimatePresence>
          {isAnswered && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }}
              className="mb-4 text-xs"
            >
              <h4 className={`font-bold flex items-center gap-1 text-sm ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                    ¡Súper correcto! (+{q.rewardExp} XP)
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500 fill-red-100" />
                    Respuesta Incorrecta
                  </>
                )}
              </h4>
              <p className={`mt-1.5 leading-relaxed font-semibold pl-6 ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                {q.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Operational button */}
        {!isAnswered ? (
          <button
            type="button"
            id="quiz-check-answer-btn"
            disabled={q.type !== 'sorting' && !selectedOption}
            onClick={handleCheckAnswer}
            className={`w-full py-4 px-4 font-black rounded-2xl shadow-md text-sm transition-all text-center border-b-4 ${
              (q.type === 'sorting' || selectedOption)
                ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700 text-white active:scale-98'
                : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
            }`}
          >
            Comprobar Respuesta
          </button>
        ) : (
          <button
            type="button"
            id="quiz-continue-step-btn"
            onClick={handleNextStep}
            className={`w-full py-4 px-4 font-black rounded-2xl shadow-md text-sm transition-all text-center border-b-4 ${
              isCorrect
                ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700 text-white'
                : 'bg-red-500 hover:bg-red-600 border-red-700 text-white'
            }`}
          >
            {currentIdx < lesson.questions.length - 1 ? 'Continuar Lección' : 'Ver Resultados del Desafío'}
          </button>
        )}
      </div>

    </div>
  );
}
