/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../types';
import AvatarCustomizer from './AvatarCustomizer';
import { Award, Trophy, Medal, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface LeaderboardProps {
  currentUserEmail?: string;
  refreshTrigger?: number;
}

export default function Leaderboard({ currentUserEmail, refreshTrigger = 0 }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/leaderboard');
        if (!res.ok) throw new Error('Error al cargar la tabla de posiciones');
        const data = await res.json();
        setEntries(data);
      } catch (err: any) {
        setError(err.message || 'Error de conexión');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [refreshTrigger]);

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="flex items-center justify-center bg-yellow-400 text-yellow-900 w-8 h-8 rounded-full shadow-md border-2 border-white font-bold animate-bounce text-sm">
            <Trophy className="w-4 h-4" />
          </div>
        );
      case 1:
        return (
          <div className="flex items-center justify-center bg-slate-300 text-slate-800 w-8 h-8 rounded-full shadow-md border-2 border-white font-bold text-sm">
            <Medal className="w-4 h-4 text-slate-700" />
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center bg-amber-600 text-amber-50 w-8 h-8 rounded-full shadow-md border-2 border-white font-bold text-sm">
            <Award className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center bg-gray-100 text-gray-500 w-8 h-8 rounded-full font-bold text-xs ring-1 ring-gray-200">
            {index + 1}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm font-medium">Buscando campeones saludables...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-xl text-red-700 text-center border border-red-200 text-sm font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 fill-current" />
          Tabla de Posiciones Pública
        </h2>
        <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full font-semibold">
          Histórico VerduPlay
        </span>
      </div>

      <div className="space-y-2 max-h-[480px] overflow-y-auto custom-scrollbar p-1">
        {entries.length === 0 ? (
          <p className="text-center text-gray-400 py-6 text-sm">¡Sé el primero en registrar un puntaje hoy!</p>
        ) : (
          entries.map((entry, index) => {
            const isSelf = currentUserEmail === entry.email;
            return (
              <motion.div
                key={entry.email + index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                  isSelf
                    ? 'bg-emerald-50 border-emerald-300 shadow-sm ring-1 ring-emerald-200'
                    : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-xs'
                }`}
              >
                {/* Left: rank + avatar + name */}
                <div className="flex items-center gap-3">
                  <div className="w-8 flex items-center justify-center">
                    {getRankBadge(index)}
                  </div>
                  
                  {/* Miniature Caricature Avatar representation */}
                  <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-slate-50 flex-shrink-0">
                    <AvatarCustomizer config={entry.caricature} readOnly={true} size={40} />
                  </div>

                  <div>
                    <span className="font-bold text-gray-800 block text-sm">
                      {entry.name || 'Estudiante Saludable'}
                      {isSelf && <span className="text-[10px] ml-1.5 bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-semibold">Tú</span>}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Nivel {entry.currentLevel || 1} • {entry.currentSteps || 0} pasos
                    </span>
                  </div>
                </div>

                {/* Right: Score */}
                <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-800 px-3 py-1.5 rounded-2xl border border-emerald-500/20">
                  <span className="font-extrabold text-sm font-mono tracking-tight">{entry.totalScore}</span>
                  <span className="text-[10px] font-extrabold uppercase">XP</span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
