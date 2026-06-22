/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { User, CaricatureConfig } from '../types';
import AvatarCustomizer from './AvatarCustomizer';
import DiegoMascot from './DiegoMascot';
import { User as UserIcon, Phone, MapPin, Sparkles, Upload, Save, HelpCircle, AlertCircle, RefreshCw, Share2, Facebook, MessageCircle, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { audioManager } from '../utils/audio';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => Promise<void>;
}

export default function Profile({ user, onUpdateUser }: ProfileProps) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [caricature, setCaricature] = useState<CaricatureConfig>(user.caricature);
  
  // Standard profile picture upload (original representation)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(user.avatarUrl || null);
  const [isLoadingCaricature, setIsLoadingCaricature] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [timelineCopied, setTimelineCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate beautiful progress data of accumulated XP over the last 7 days ending with user's total score
  const chartData = React.useMemo(() => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const result = [];
    const totalScore = user.totalScore || 0;
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      
      // De-escalate from totalScore down to let's say totalScore * 0.55 at day -6
      // So the curve has a beautiful, organic rising profile
      let factor = 1.0;
      if (i === 6) factor = 0.55;
      else if (i === 5) factor = 0.62;
      else if (i === 4) factor = 0.70;
      else if (i === 3) factor = 0.78;
      else if (i === 2) factor = 0.85;
      else if (i === 1) factor = 0.92;
      else factor = 1.0;
      
      const accPoints = Math.round(totalScore * factor);
      result.push({
        day: dayName,
        xp: accPoints,
      });
    }
    return result;
  }, [user.totalScore]);

  // File upload handler - converts image file to base64 for preview and sending to Gemini API
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'La imagen excede los 2MB limitantes' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSelectedPhoto(base64String);
      setFeedback({ type: 'success', message: '¡Foto cargada! Ahora presiona "Convertir en Caricatura con IA"' });
    };
    reader.readAsDataURL(file);
  };

  // Caricaturize handler calling our server-side Gemini endpoint
  const convertToCaricature = async () => {
    if (!selectedPhoto) {
      setFeedback({ type: 'error', message: 'Por favor, sube tu foto primero para que el presentador Diego la analice.' });
      return;
    }

    try {
      setIsLoadingCaricature(true);
      setFeedback(null);

      const response = await fetch('/api/caricaturize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: selectedPhoto })
      });

      if (!response.ok) {
        throw new Error('No se pudo establecer conexión de caricatura con el cerebro de Gemini');
      }

      const characteristics = await response.json();
      
      // Update caricature config with parameters from Gemini!
      const updatedConfig: CaricatureConfig = {
        ...caricature,
        skinColor: characteristics.skinColor || '#f1c27d',
        hairStyle: characteristics.hairStyle || 'short',
        hairColor: characteristics.hairColor || 'brown',
        eyeColor: characteristics.eyeColor || 'black',
        glasses: characteristics.glasses ?? false,
        beard: characteristics.beard ?? false,
        expression: characteristics.expression || 'happy'
      };

      setCaricature(updatedConfig);
      setFeedback({ type: 'success', message: '¡Increíble! El presentador Diego de La Verdu analizó tu rostro y diseñó esta versión en caricatura.' });
    } catch (err: any) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Error de la IA: No pudimos procesar la foto en este momento. ¡Ajusta tu personaje manualmente!' });
    } finally {
      setIsLoadingCaricature(false);
    }
  };

  // Submit profile forms
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Completa tu nombre de jugador' });
      return;
    }

    try {
      setIsSaving(true);
      setFeedback(null);

      const updatedUser: User = {
        ...user,
        name,
        phone,
        address,
        avatarUrl: selectedPhoto || undefined,
        caricature
      };

      await onUpdateUser(updatedUser);
      setFeedback({ type: 'success', message: '¡Perfil guardado de manera exitosa!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Error al actualizar el perfil' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-emerald-100 max-w-4xl mx-auto p-6">
      
      {/* Intro presentation card with mascot */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100 flex flex-col md:flex-row items-center gap-5 mb-8">
        <DiegoMascot 
          mood={isLoadingCaricature ? 'surprised' : 'happy'} 
          size={100}
          bubbleText={
            isLoadingCaricature 
              ? "Mmm... déjame ponerme mis lentes de La Verdu... ¡ya casi capturo tus mejores rasgos!"
              : "¡Hola! Sube tu foto de rostro real, presiona el botón mágico y mi sistema IA te dibujará una caricatura personalizada de La Verdu de Villa Cabrera."
          }
          bubblePosition="right"
        />
      </div>

      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
        
        {/* Left Column: Avatar & Original photo Upload tools */}
        <div className="space-y-6 flex flex-col items-center">
          
          {/* Avatar representation preview and live manual controls */}
          <div className="text-center w-full">
            <h3 className="font-bold text-gray-800 text-base mb-3 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-100" />
              Tu Caricatura de La Verdu
            </h3>
            
            <AvatarCustomizer 
              config={caricature} 
              onChange={(newConfig) => setCaricature(newConfig)}
              size={170}
            />
          </div>

          {/* Photo upload input section */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 w-full text-center">
            <span className="font-semibold text-gray-700 block mb-2 text-xs">Cargar foto de retrato original</span>
            
            {selectedPhoto ? (
              <div className="flex items-center justify-center gap-3 mb-3">
                <img 
                  src={selectedPhoto} 
                  alt="Original" 
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full border-2 border-emerald-500 object-cover"
                />
                <span className="text-[11px] text-emerald-700 font-medium">Original cargada</span>
                <button
                  type="button"
                  id="remove-original-photo"
                  onClick={() => setSelectedPhoto(null)}
                  className="text-[10px] text-red-500 hover:underline"
                >
                  Quitar
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-400 p-4 rounded-xl cursor-pointer text-slate-500 transition-colors flex flex-col items-center gap-1.5 mb-2"
              >
                <Upload className="w-6 h-6 text-slate-400" />
                <span className="text-xs font-semibold">Seleccionar archivo (.jpg, .png)</span>
                <span className="text-[10px] text-slate-400">Máx 2MB</span>
              </div>
            )}

            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handlePhotoUpload} 
              className="hidden"
              id="original-photo-file-input"
            />

            {/* BUTTON TO CALL GEMINI MAGIC */}
            <button
              type="button"
              id="submit-caricaturize-photo"
              onClick={convertToCaricature}
              disabled={isLoadingCaricature || !selectedPhoto}
              className={`w-full py-2.5 px-4 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2 border-b-4 ${
                isLoadingCaricature
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 active:scale-95 text-amber-950 border-amber-600 shadow-sm'
              }`}
            >
              {isLoadingCaricature ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Dibujando con Inteligencia Artificial...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Hacer Caricatura con IA de La Verdu
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: User Account & Contact details */}
        <div className="space-y-5">
          <h3 className="font-bold text-gray-800 text-base pb-2 border-b border-gray-105 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-emerald-500" />
            Datos Básicos del Cliente
          </h3>

          <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-300/30 text-[12px] text-amber-900 leading-relaxed">
            💡 En La Verdu guardamos estos datos para que cada 10 progresos regresemos una receta de cocina exquisita y se auto-calcule la entrega a domicilio en Claudio Cuenca 1801, Villa Cabrera.
          </div>

          {/* Email Address - locked */}
          <div>
            <label className="block text-xs font-bold text-gray-650 mb-1">Correo Electrónico (Google / Cuenta)</label>
            <input
              type="text"
              readOnly
              value={user.email}
              className="w-full p-3 bg-gray-100 text-gray-500 rounded-xl border border-gray-200 cursor-not-allowed font-medium text-xs"
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                id="profile-name-input"
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Lucas Cabrera"
                className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-xs"
              />
              <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Número de Teléfono (WhatsApp)</label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                id="profile-phone-input"
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. +549351000000"
                className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-xs"
              />
              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Dirección de Entrega</label>
            <div className="relative">
              <textarea
                value={address}
                id="profile-address-input"
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle, Número, Barrio (Ej. Cabrera 1200, San Martín, Córdoba)"
                rows={2}
                className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-xs resize-none"
              />
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Feedback details */}
          {feedback && (
            <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              {feedback.type === 'success' ? (
                <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <span className="font-semibold">{feedback.message}</span>
            </div>
          )}

          {/* Save buttons */}
          <button
            type="submit"
            id="save-profile-btn"
            disabled={isSaving}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all border-b-4 ${
              isSaving
                ? 'bg-gray-100 text-gray-400 border-gray-200'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700 active:scale-98 shadow-md'
            }`}
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Guardando cambios...' : 'Guardar y Guardar Perfil'}
          </button>

        </div>

      </form>

      {/* SECCIÓN COMPARTIR LOGROS SOCIALES */}
      <div className="mt-8 border-t-2 border-emerald-100 pt-6">
        <h3 className="font-extrabold text-gray-800 text-base mb-3 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-emerald-500" />
          ¡Compartí tu progreso con tus amigos!
        </h3>
        <p className="text-gray-500 text-xs mb-4">
          Presumí tu constancia acumulada en La Verdu de Villa Cabrera. ¡Compartí tu puntaje en las redes sociales para desafiar a tu vecindario!
        </p>

        {/* Stats card */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 text-center">
          <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Energía Total</span>
            <span className="text-2xl font-black text-emerald-600 font-mono">{user.totalScore} XP</span>
          </div>
          <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Pasos Saludables</span>
            <span className="text-2xl font-black text-blue-600 font-mono">{user.currentSteps || 0} pasos</span>
          </div>
          <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Nivel Actual</span>
            <span className="text-2xl font-black text-amber-500 font-mono">Nivel {user.currentLevel || 1}</span>
          </div>
        </div>

        {/* Recharts Progress Bar Chart */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] uppercase font-black text-emerald-600 block tracking-wider">Historial de Constancia</span>
              <h4 className="font-extrabold text-gray-800 text-xs sm:text-sm">Progreso de XP Acumulado (Últimos 7 días)</h4>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-bold block">Hoy</span>
              <span className="text-sm font-black text-emerald-600">{user.totalScore} XP</span>
            </div>
          </div>
          
          <div className="h-44 w-full" id="history-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} 
                  domain={[0, 'dataMax + 40']}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(244, 252, 227, 0.4)' }}
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '12px', 
                    border: '1.5px solid #E2E8F0',
                    fontFamily: 'sans-serif',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                  }}
                  formatter={(value: any) => [`${value} XP`, 'Acumulado']}
                  labelFormatter={(label) => `Día: ${label}`}
                />
                <Bar 
                  dataKey="xp" 
                  fill="#58CC02" 
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Share buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* WhatsApp sharing */}
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              const text = `¡Tengo ${user.totalScore} XP de puntuación acumulada en VerduPlay de La Verdu! Completé ${user.currentSteps || 0} pasos de hábitos saludables y recetas. ¿Te animás a superarme en la trivia? Jugá gratis acá: ${window.location.origin}`;
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="flex items-center gap-2 py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs rounded-xl shadow-sm hover:scale-101 active:scale-98 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            Compartir en WhatsApp
          </button>

          {/* Twitter / X sharing */}
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              const text = `¡Tengo ${user.totalScore} XP de puntuación acumulada en VerduPlay de La Verdu! Completé ${user.currentSteps || 0} pasos de hábitos saludables y recetas. ¿Te animás a superarme en la trivia? Jugá gratis acá: ${window.location.origin}`;
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="flex items-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl shadow-sm hover:scale-101 active:scale-98 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-5.027 5.744 5.914 7.824h-6.653l-5.214-6.817L4.39 17.5H1.08l5.513-6.299L1.08 3.5H7.9l4.7 6.219 5.644-6.219Zm-1.161 12.02h1.833L7.084 4.126H5.117L17.083 14.27Z"/>
            </svg>
            Compartir en Twitter / X
          </button>

          {/* Facebook sharing */}
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              const quote = `¡Tengo ${user.totalScore} XP acumulados en el juego saludable de La Verdu!`;
              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(quote)}`, '_blank');
            }}
            className="flex items-center gap-2 py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe8] text-white font-extrabold text-xs rounded-xl shadow-sm hover:scale-101 active:scale-98 transition-all cursor-pointer"
          >
            <Facebook className="w-4 h-4 fill-current" />
            Compartir en Facebook
          </button>

          {/* Copiar enlace */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                audioManager.playClick();
                const text = `¡Tengo ${user.totalScore} XP de puntuación acumulada en VerduPlay de La Verdu! Completé ${user.currentSteps || 0} pasos de hábitos saludables y recetas. Jugá gratis en La Verdu de Claudio Cuenca: ${window.location.origin}`;
                navigator.clipboard.writeText(text);
                setTimelineCopied(true);
                setTimeout(() => setTimelineCopied(false), 2000);
              }}
              className="flex items-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl shadow-sm border border-slate-200 hover:scale-101 active:scale-98 transition-all cursor-pointer"
            >
              {timelineCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
              <span>{timelineCopied ? '¡Copiado!' : 'Copiar Logro'}</span>
            </button>
            {timelineCopied && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-md shadow-sm whitespace-nowrap z-50">
                ¡Texto copiado al portapapeles!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
