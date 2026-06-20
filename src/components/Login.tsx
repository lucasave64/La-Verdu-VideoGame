/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, CaricatureConfig } from '../types';
import DiegoMascot from './DiegoMascot';
import { Mail, Lock, User as UserIcon, Phone, MapPin, CheckCircle2, ChevronRight, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioManager } from '../utils/audio';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Google Simulated Sign-In Popover
  const [showGoogleSimulator, setShowGoogleSimulator] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  // Prefill Google details dynamically
  useEffect(() => {
    if (showGoogleSimulator) {
      setGoogleEmail(email || '');
      setGoogleName(name || '');
    }
  }, [showGoogleSimulator, email, name]);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check saved memory to read "Remember Me" credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem('verduplay_remember_email');
    const savedPass = localStorage.getItem('verduplay_remember_password');
    if (savedEmail && savedPass) {
      setEmail(savedEmail);
      setPassword(savedPass);
      setRememberMe(true);
    }
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor completa los campos de correo y contraseña.');
      return;
    }

    if (isRegister && !name) {
      setErrorMsg('Por favor introduce tu nombre para saludarte en el juego.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg(null);

      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister 
        ? { email, password, name, phone, address }
        : { email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en las credenciales');
      }

      const activeUser: User = await response.json();

      // Remember credentials in LocalStorage if checked
      if (rememberMe) {
        localStorage.setItem('verduplay_remember_email', email);
        localStorage.setItem('verduplay_remember_password', password);
      } else {
        localStorage.removeItem('verduplay_remember_email');
        localStorage.removeItem('verduplay_remember_password');
      }

      onLoginSuccess(activeUser);

    } catch (err: any) {
      setErrorMsg(err.message || 'No se pudo conectar al servidor de La Verdu. Reintenta.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google authentication simulator
  const handleGoogleMockLogin = async (selectedEmail: string, selectedName: string) => {
    try {
      setIsLoading(true);
      setShowGoogleSimulator(false);
      setErrorMsg(null);

      const response = await fetch('/api/auth/google-sim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: selectedEmail, name: selectedName })
      });

      if (!response.ok) {
        throw new Error('Error en el registro simular de Google Client');
      }

      const activeUser: User = await response.json();
      onLoginSuccess(activeUser);

    } catch (err: any) {
      setErrorMsg('Error en el inicio de sesion de Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-2xl border-4 border-emerald-400 overflow-hidden text-sm relative">
      
      {/* Decorative La Verdu Header Title & Mascot Diego */}
      <div className="bg-gradient-to-b from-emerald-500 to-emerald-600 text-white p-6 relative flex flex-col items-center border-b-4 border-yellow-400">
        <div className="bg-white rounded-full p-1 shadow-md flex items-center justify-center border border-gray-200 w-24 h-24 mb-4 select-none">
          {/* Visual SVG Brand Logo resembling La Verdu de Villa Cabrera exactly as requested */}
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <defs>
              {/* Arched text paths */}
              <path id="login-top-text-path" d="M 18 64 A 42 42 0 0 1 102 64" fill="none" />
              <path id="login-bottom-text-path" d="M 102 56 A 42 42 0 0 1 18 56" fill="none" />
            </defs>

            {/* Main Outer White Badge */}
            <circle cx="60" cy="60" r="56" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
            <circle cx="60" cy="60" r="51.5" fill="none" stroke="#000000" strokeWidth="0.75" />

            {/* Gold Badges/Banners on left and right */}
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

            {/* Center Food Circle with clean background */}
            <circle cx="60" cy="60" r="28" fill="#F8FAFC" stroke="#000000" strokeWidth="1.5" />

            {/* Rich Vector illustration of Fruits & Vegetables inside */}
            <g transform="translate(60, 60)">
              {/* Pineapple in center back */}
              <g transform="translate(0, -9) scale(0.95)">
                {/* Green pineapple crown leaves */}
                <path d="M 0 -13 L -3 -6 L 3 -6 Z" fill="#15803D" />
                <path d="M -4 -11 L -7 -4 L -1 -4 Z" fill="#166534" />
                <path d="M 4 -11 L 7 -4 L 1 -4 Z" fill="#166534" />
                {/* Pineapple body */}
                <ellipse cx="0" cy="1" rx="8" ry="10" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.75" />
                {/* Cross pattern */}
                <path d="M -6 -4 L 6 6" stroke="#854D0E" strokeWidth="0.5" />
                <path d="M 6 -4 L -6 6" stroke="#854D0E" strokeWidth="0.5" />
              </g>

              {/* Watermelon slice on the left-back */}
              <g transform="translate(-12, -3) rotate(-20) scale(0.85)">
                <path d="M -10 0 A 10 10 0 0 0 10 0 Z" fill="#15803D" />
                <path d="M -8.5 -1 A 8.5 8.5 0 0 0 8.5 -1 Z" fill="#EF4444" />
                <circle cx="-3" cy="3" r="0.6" fill="#000000" />
                <circle cx="3" cy="3" r="0.6" fill="#000000" />
                <circle cx="0" cy="5" r="0.6" fill="#000000" />
              </g>

              {/* Red apples/mangoes and tomato cluster in front */}
              {/* Red Apple (Left-front) */}
              <g transform="translate(-8, 7) scale(0.95)">
                <circle cx="0" cy="0" r="7.5" fill="#EF4444" />
                {/* Reflection highlight */}
                <path d="M -4 -4 A 4 4 0 0 1 -1 -7" stroke="#FFFFFF" strokeWidth="1.25" fill="none" opacity="0.6" strokeLinecap="round" />
                {/* Stem */}
                <path d="M 0 -7.5 C 1 -10, 4 -9, 3 -7" stroke="#78350F" strokeWidth="0.75" fill="none" />
              </g>

              {/* Bright round orange (Right-front) */}
              <g transform="translate(8, 7) scale(0.95)">
                <circle cx="0" cy="0" r="7.5" fill="#F97316" />
                <circle cx="2" cy="-3" r="1.5" fill="#FED7AA" opacity="0.6" />
                {/* Leaf */}
                <path d="M 0 -7.5 C 1 -9, 3 -10, 3 -8 C 3 -6, 1 -6, 0 -7.5" fill="#22C55E" />
              </g>

              {/* Yellow banana/pear bottom center */}
              <g transform="translate(0, 11) scale(0.85)">
                <ellipse cx="0" cy="0" rx="9" ry="5.5" fill="#FDE047" stroke="#EAB308" strokeWidth="0.5" />
                {/* Green tips */}
                <path d="M -9 0 L -10 1" stroke="#854D0E" strokeWidth="1" />
                <path d="M 9 0 L 10 1" stroke="#854D0E" strokeWidth="1" />
              </g>

              {/* Grape berries scattered */}
              <g transform="translate(-13, -11) scale(0.8)">
                <circle cx="0" cy="0" r="3" fill="#8B5CF6" />
                <circle cx="-1.5" cy="3.5" r="2.8" fill="#7C3AED" />
                <circle cx="2" cy="1.5" r="2.8" fill="#6D28D9" />
              </g>
            </g>

            {/* Arched Text on Top: LA VERDU */}
            <text fill="#000000" fontSize="10" fontWeight="900" fontFamily="var(--font-display)" letterSpacing="0.5">
              <textPath href="#login-top-text-path" startOffset="50%" textAnchor="middle">
                LA VERDU
              </textPath>
            </text>

            {/* Arched Text on Bottom: DE VILLA CABRERA */}
            <text fill="#000000" fontSize="7.5" fontWeight="900" fontFamily="var(--font-display)" letterSpacing="0.2">
              <textPath href="#login-bottom-text-path" startOffset="50%" textAnchor="middle">
                DE VILLA CABRERA
              </textPath>
            </text>
          </svg>
        </div>

        <DiegoMascot 
          mood="happy" 
          size={100} 
          bubbleText={
            isRegister 
              ? "¡Regístrate para guardar tu puntaje e historial en VerduPlay!"
              : "¡Bienvenido vecino de Villa Cabrera! Ingresa a tu cuenta para jugar."
          } 
          bubblePosition="right" 
          className="text-gray-900"
        />
      </div>

      {/* Forms Area */}
      <div className="p-6">
        
        {/* Toggle options tabs */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
          <button
            type="button"
            id="tab-toggle-login"
            onClick={() => {
              audioManager.playClick();
              setIsRegister(false);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${!isRegister ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            INGRESAR
          </button>
          <button
            type="button"
            id="tab-toggle-register"
            onClick={() => {
              audioManager.playClick();
              setIsRegister(true);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${isRegister ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            CREAR CUENTA
          </button>
        </div>

        {/* Error message displays */}
        {errorMsg && (
          <div className="bg-red-50 text-red-800 border border-red-200 p-3 rounded-2xl text-xs mb-4 text-center font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {/* Full Name (Registration only) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  id="auth-name-input"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Lucas Cabrera"
                  className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-xs"
                />
                <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Correo Electrónico</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                id="auth-email-input"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ej. tucorreo@gmail.com"
                className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-xs"
              />
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Secret Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                id="auth-password-input"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-xs"
              />
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Phone (Registration only) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Teléfono (WhatsApp)</label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  id="auth-phone-input"
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej. +549351000000"
                  className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-xs"
                />
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}

          {/* Address (Registration only) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Dirección de Entrega</label>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  id="auth-address-input"
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej. Claudio Cuenca 1801, San Martin, Córdoba"
                  className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-xs"
                />
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}

          {/* Remember user checkbox */}
          <div className="flex items-center justify-between py-1 text-xs select-none">
            <label className="flex items-center gap-2 text-gray-600 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                id="remember-credentials-checkbox"
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-400 cursor-pointer w-4 h-4"
              />
              Recordar mi usuario y contraseña
            </label>
          </div>

          {/* Main button */}
          <button
            type="submit"
            id="auth-submit-btn"
            disabled={isLoading}
            className={`w-full py-3.5 px-4 rounded-2xl text-white font-extrabold text-sm transition-all border-b-4 flex items-center justify-center gap-2 shadow-md ${
              isLoading 
                ? 'bg-gray-300 border-gray-400 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-555 border-emerald-700 active:scale-98'
            }`}
          >
            <LogIn className="w-4 h-4 animate-pulse" />
            {isLoading 
              ? 'Procesando juego...' 
              : isRegister 
                ? 'CREAR CUENTA Y JUGAR' 
                : 'INICIAR SESIÓN'
            }
          </button>
        </form>

        {/* OR Spacer */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 font-bold text-xs uppercase">Ó conéctate rápido</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Google sign-in button */}
        <button
          type="button"
          id="social-google-auth-btn"
          onClick={() => setShowGoogleSimulator(true)}
          className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-2xl border border-gray-250 font-bold text-xs text-gray-700 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
        >
          {/* Cute Google Logo */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Registrarse con Google Account
        </button>

      </div>

      {/* OVERLAID GOOGLE AUTH POPUP SIMULATOR */}
      <AnimatePresence>
        {showGoogleSimulator && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-gray-100 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowGoogleSimulator(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-4">
                {/* Google symbol */}
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                </svg>
                <span className="font-extrabold text-gray-700 text-sm">Iniciar sesión con Google</span>
              </div>

              <div className="border-t border-gray-100 my-3"></div>

              <p className="text-xs text-gray-500 mb-5 leading-normal">
                VerduPlay solicita conectar tu cuenta de correo de Google para rellenar automáticamente tu perfil e historial saludable.
              </p>

              {/* Custom Editable Fields instead of hardcoded pre-selected list */}
              <div className="space-y-3 text-left">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Correo Electrónico de Google
                  </label>
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="ejemplo@gmail.com"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nombre Completo / Apodo
                  </label>
                  <input
                    type="text"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    placeholder="Tu nombre aquí"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-xs text-gray-800"
                  />
                </div>

                <button
                  type="button"
                  id="google-sim-select-primary"
                  onClick={() => {
                    if (googleEmail.trim() && googleName.trim()) {
                      handleGoogleMockLogin(googleEmail.trim(), googleName.trim());
                    }
                  }}
                  disabled={!googleEmail.trim() || !googleName.trim()}
                  className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold rounded-2xl transition-colors shadow-md flex items-center justify-center gap-1.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Conectar Cuenta y Continuar
                </button>
              </div>

              <p className="text-[10px] text-center text-gray-400 mt-5">
                Al continuar, Google comparte tu nombre, foto de perfil y dirección de correo con La Verdu.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
