/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CaricatureConfig } from '../types';

interface AvatarCustomizerProps {
  config: CaricatureConfig;
  onChange?: (newConfig: CaricatureConfig) => void;
  readOnly?: boolean;
  size?: number;
}

export const SKIN_TONES = [
  { name: 'Claro', value: '#ffdbac' },
  { name: 'Cálido', value: '#f1c27d' },
  { name: 'Tostado', value: '#e0ac69' },
  { name: 'Bronceado', value: '#c68642' },
  { name: 'Oscuro', value: '#8d5524' }
];

export const HAIR_STYLES = [
  { name: 'Corto', value: 'short' },
  { name: 'Crespo', value: 'curly' },
  { name: 'Largo', value: 'long' },
  { name: 'Calvo', value: 'bald' },
  { name: 'Puntiagudo', value: 'spiky' },
  { name: 'Ondulado', value: 'wavy' }
];

export const HAIR_COLORS = [
  { name: 'Negro', value: 'black' },
  { name: 'Castaño', value: 'brown' },
  { name: 'Rubio', value: 'blonde' },
  { name: 'Pelirrojo', value: 'red' },
  { name: 'Gris', value: 'gray' }
];

export const EYE_COLORS = [
  { name: 'Negro', value: 'black' },
  { name: 'Azul', value: 'blue' },
  { name: 'Verde', value: 'green' },
  { name: 'Marrón', value: 'brown' }
];

export const EXPRESSIONS = [
  { name: 'Feliz', value: 'happy' },
  { name: 'Sonriente', value: 'smiling' },
  { name: 'Neutral', value: 'neutral' },
  { name: 'Sorprendido', value: 'surprised' }
];

export default function AvatarCustomizer({
  config,
  onChange,
  readOnly = false,
  size = 180
}: AvatarCustomizerProps) {

  const handleUpdate = (field: keyof CaricatureConfig, value: any) => {
    if (readOnly || !onChange) return;
    onChange({
      ...config,
      [field]: value
    });
  };

  // Convert English color names to actual hex/classes for styling
  const getHairColorHex = (color: string) => {
    switch (color) {
      case 'black': return '#1a1a1a';
      case 'brown': return '#5c4033';
      case 'blonde': return '#e8c35e';
      case 'red': return '#c84b31';
      case 'gray': return '#8a8a8a';
      default: return '#5c4033';
    }
  };

  const getEyeColorHex = (color: string) => {
    switch (color) {
      case 'black': return '#1f1f21';
      case 'blue': return '#3a86c8';
      case 'green': return '#588f34';
      case 'brown': return '#6d4c41';
      default: return '#1f1f21';
    }
  };

  const hairHex = getHairColorHex(config.hairColor);
  const eyeHex = getEyeColorHex(config.eyeColor);

  return (
    <div className="flex flex-col items-center">
      {/* SVG Avatar Representation - Highly responsive and vector */}
      <div 
        className="relative bg-gradient-to-br from-yellow-100 to-emerald-100 rounded-full border-4 border-white shadow-xl overflow-hidden flex items-center justify-center p-2 mb-4"
        style={{ width: size, height: size }}
      >
        <svg 
          viewBox="0 0 200 200" 
          className="w-full h-full transition-all duration-300"
          id="avatar-caricature-svg"
        >
          {/* DEFINITIONS FOR GRADIENTS or SHADOWS */}
          <defs>
            <radialGradient id="grad-face" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#000" stopOpacity={0.06} />
            </radialGradient>
            <clipPath id="circle-clip">
              <circle cx="100" cy="100" r="95" />
            </clipPath>
          </defs>

          {/* BACKGROUND CIRCLE GRAPHICS */}
          <circle cx="100" cy="100" r="95" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
          
          <g clipPath="url(#circle-clip)">
            {/* BACKGROUND COMPONENT */}
            <circle cx="100" cy="100" r="90" fill="#f0fdf4" opacity="0.6" />

            {/* BASE BODY / SHIRT or LA VERDU APRON */}
            {config.hasApron ? (
              <g id="apron-body">
                {/* Shoulders base */}
                <path d="M40 200 C40 160, 60 145, 100 145 C140 145, 160 160, 160 200 Z" fill="#15803d" />
                {/* Red/Amber T-shirt sleeves showing slightly underneath */}
                <path d="M40 200 C38 180, 42 165, 55 158" stroke="#f97316" strokeWidth="10" strokeLinecap="round" />
                <path d="M160 200 C162 180, 158 165, 145 158" stroke="#f97316" strokeWidth="10" strokeLinecap="round" />
                
                {/* Apron bib / front straps */}
                <path d="M70 145 L130 145 L120 120 L80 120 Z" fill="#166534" />
                <path d="M80 120 L75 110" stroke="#f97316" strokeWidth="4" />
                <path d="M120 120 L125 110" stroke="#f97316" strokeWidth="4" />
                
                {/* LA VERDU Logo on Apron */}
                <ellipse cx="100" cy="162" rx="22" ry="14" fill="white" stroke="#eab308" strokeWidth="2" />
                <text x="100" y="161" fill="#15803d" fontSize="6" fontWeight="bold" textAnchor="middle">LA VERDU</text>
                <text x="100" y="169" fill="#ca8a04" fontSize="4.5" textAnchor="middle">since 1996</text>
              </g>
            ) : (
              <g id="casual-body">
                {/* Shoulders casual - friendly orange with brand flavor */}
                <path d="M40 200 C40 155, 60 140, 100 140 C140 140, 160 155, 160 200 Z" fill="#f97316" />
                <circle cx="100" cy="140" r="15" fill={config.skinColor} />
                {/* Yellow crew neck collar */}
                <path d="M82 143 C82 153, 118 153, 118 143 Z" fill="#eab308" />
              </g>
            )}

            {/* NECK */}
            <rect x="88" y="105" width="24" height="25" rx="5" fill={config.skinColor} />
            <rect x="88" y="112" width="24" height="18" fill="#000" opacity="0.1" />

            {/* EARS */}
            <circle cx="68" cy="88" r="10" fill={config.skinColor} />
            <circle cx="132" cy="88" r="10" fill={config.skinColor} />
            <circle cx="68" cy="88" r="6" fill="#000" opacity="0.08" />
            <circle cx="132" cy="88" r="6" fill="#000" opacity="0.08" />

            {/* FACE SHAPE */}
            <rect x="70" y="55" width="60" height="60" rx="24" fill={config.skinColor} />
            <rect x="70" y="55" width="60" height="60" rx="24" fill="url(#grad-face)" />

            {/* BEARD / GOATEE */}
            {config.beard && (
              <g id="beard">
                {/* Cute stubble/beard contour */}
                <path d="M70 85 C70 115, 130 115, 130 85 C130 125, 70 125, 70 85 Z" fill={hairHex} opacity="0.8" />
                {/* Friendly mustache */}
                <path d="M85 91 C92 88, 108 88, 115 91 C110 95, 90 95, 85 91 Z" fill={hairHex} />
              </g>
            )}

            {/* EYES */}
            {/* Eye whites */}
            <circle cx="86" cy="80" r="7" fill="white" stroke="#ccc" strokeWidth="0.5" />
            <circle cx="114" cy="80" r="7" fill="white" stroke="#ccc" strokeWidth="0.5" />
            {/* Pupils */}
            <circle cx="86" cy="80" r="4" fill={eyeHex} />
            <circle cx="114" cy="80" r="4" fill={eyeHex} />
            {/* Eye reflection sparkles */}
            <circle cx="84.5" cy="78.5" r="1.5" fill="white" />
            <circle cx="112.5" cy="78.5" r="1.5" fill="white" />

            {/* NOSE */}
            <path d="M96 82 C96 79, 104 79, 104 82 C104 88, 96 88, 96 82 Z" fill="#000" opacity="0.12" />
            <path d="M97 81 C97 79, 103 79, 103 81 C103 85, 97 85, 97 81 Z" fill={config.skinColor} />

            {/* EXPRESSION - MOUTH */}
            {config.expression === 'happy' || config.expression === 'smiling' ? (
              <g id="mouth-smiling">
                {/* Happy wide smiley with teeth */}
                <path d="M85 94 C85 106, 115 106, 115 94 Z" fill="#6b21a8" />
                <path d="M85 94 C90 98, 110 98, 115 94 Z" fill="white" />
                <path d="M92 101 C95 103, 105 103, 108 101 Z" fill="#f43f5e" opacity="0.8" />
              </g>
            ) : config.expression === 'surprised' ? (
              <g id="mouth-surprised">
                {/* Wow gasp circle */}
                <circle cx="100" cy="98" r="6" fill="#6b21a8" />
              </g>
            ) : (
              <g id="mouth-neutral">
                {/* Calm line */}
                <path d="M90 97 C95 95, 105 95, 110 97" stroke="#4a154b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* EYE BROWS */}
            <path d="M78 72 C82 69, 90 70, 92 73" stroke={hairHex} strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M122 72 C118 69, 110 70, 108 73" stroke={hairHex} strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* GLASSES */}
            {config.glasses && (
              <g id="specs">
                {/* Left frame */}
                <circle cx="86" cy="80" r="11" stroke="#ca8a04" strokeWidth="3.5" fill="none" />
                {/* Right frame */}
                <circle cx="114" cy="80" r="11" stroke="#ca8a04" strokeWidth="3.5" fill="none" />
                {/* Connecting bridge */}
                <path d="M97 80 L103 80" stroke="#ca8a04" strokeWidth="4" />
                {/* Temple sides */}
                <path d="M75 80 L69 77" stroke="#ca8a04" strokeWidth="2.5" />
                <path d="M125 80 L131 77" stroke="#ca8a04" strokeWidth="2.5" />
              </g>
            )}

            {/* HAIR STYLE GRAPHICS */}
            {config.hairStyle !== 'bald' && (
              <g id="hair" fill={hairHex}>
                {config.hairStyle === 'short' && (
                  <path d="M66 58 C70 42, 130 42, 134 58 C138 45, 118 35, 100 35 C82 35, 62 45, 66 58 C64 64, 69 70, 71 70 C71 70, 75 58, 80 58 L120 58 C125 58, 129 70, 129 70 C131 70, 136 64, 134 58 Z" />
                )}
                {config.hairStyle === 'curly' && (
                  <g>
                    <circle cx="90" cy="40" r="14" />
                    <circle cx="110" cy="40" r="14" />
                    <circle cx="78" cy="48" r="12" />
                    <circle cx="122" cy="48" r="12" />
                    <circle cx="98" cy="34" r="15" />
                    <circle cx="70" cy="60" r="10" />
                    <circle cx="130" cy="60" r="10" />
                  </g>
                )}
                {config.hairStyle === 'long' && (
                  <g>
                    {/* Frame of long hair behind ears */}
                    <path d="M68 60 Q55 90, 62 135 L68 135 Q74 100, 72 60 Z" />
                    <path d="M132 60 Q145 90, 138 135 L132 135 Q126 100, 128 60 Z" />
                    {/* Top hair dome */}
                    <path d="M66 58 C70 38, 130 38, 134 58 C140 45, 120 30, 100 30 C80 30, 60 45, 66 58 Z" />
                  </g>
                )}
                {config.hairStyle === 'spiky' && (
                  <path d="M68 55 L75 35 L84 45 L95 30 L105 30 L116 45 L125 35 L132 55 L130 65 L115 54 L100 60 L85 54 L70 65 Z" />
                )}
                {config.hairStyle === 'wavy' && (
                  <g>
                    <path d="M66 58 C70 42, 130 42, 134 58 C138 45, 118 32, 100 32 C82 32, 62 45, 66 58 Z" />
                    {/* Waves cascading down */}
                    <path d="M68 58 C62 70, 75 80, 68 95 C62 108, 67 115, 65 125 L73 125 C75 115, 70 108, 76 95 C82 82, 70 70, 74 58 Z" />
                    <path d="M132 58 C138 70, 125 80, 132 95 C138 108, 133 115, 135 125 L127 125 C125 115, 130 108, 124 95 C118 82, 130 70, 126 58 Z" />
                  </g>
                )}
              </g>
            )}

            {/* BLUSH FOR CHEEKS */}
            <circle cx="78" cy="87" r="4" fill="#ef4444" opacity="0.25" />
            <circle cx="122" cy="87" r="4" fill="#ef4444" opacity="0.25" />
          </g>
        </svg>
      </div>

      {/* CONTROLS (If not readOnly) */}
      {!readOnly && onChange && (
        <div className="w-full space-y-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-emerald-100 shadow-sm max-h-[280px] overflow-y-auto custom-scrollbar text-xs">
          {/* Tono de Piel */}
          <div>
            <span className="font-semibold text-gray-700 block mb-1">Color de Piel</span>
            <div className="flex flex-wrap gap-2">
              {SKIN_TONES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  id={`skin-color-${t.value.replace('#','')}`}
                  onClick={() => handleUpdate('skinColor', t.value)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${config.skinColor === t.value ? 'border-emerald-600 scale-125 shadow-sm' : 'border-gray-200 hover:scale-110'}`}
                  style={{ backgroundColor: t.value }}
                  title={t.name}
                />
              ))}
            </div>
          </div>

          {/* Peinado */}
          <div>
            <span className="font-semibold text-gray-700 block mb-1">Peinado</span>
            <div className="flex flex-wrap gap-1">
              {HAIR_STYLES.map(style => (
                <button
                  key={style.value}
                  type="button"
                  id={`hair-style-${style.value}`}
                  onClick={() => handleUpdate('hairStyle', style.value)}
                  className={`px-2 py-1 rounded-lg border text-[11px] font-medium transition-all ${config.hairStyle === style.value ? 'bg-emerald-500 text-white border-emerald-500 scale-105' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* Color de Piel / Pelo */}
          {config.hairStyle !== 'bald' && (
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Color de Pelo</span>
              <div className="flex flex-wrap gap-2">
                {HAIR_COLORS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    id={`hair-color-${c.value}`}
                    onClick={() => handleUpdate('hairColor', c.value)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${config.hairColor === c.value ? 'border-emerald-600 scale-115 shadow' : 'border-gray-200 hover:scale-105'}`}
                    style={{ backgroundColor: getHairColorHex(c.value) }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Color de Ojos */}
          <div>
            <span className="font-semibold text-gray-700 block mb-1">Color de Ojos</span>
            <div className="flex flex-wrap gap-2">
              {EYE_COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  id={`eye-color-${c.value}`}
                  onClick={() => handleUpdate('eyeColor', c.value)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${config.eyeColor === c.value ? 'border-emerald-600 scale-115 shadow' : 'border-gray-200 hover:scale-105'}`}
                  style={{ backgroundColor: getEyeColorHex(c.value) }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Expresión facial */}
          <div>
            <span className="font-semibold text-gray-700 block mb-1">Expresión</span>
            <div className="flex flex-wrap gap-1">
              {EXPRESSIONS.map(exp => (
                <button
                  key={exp.value}
                  type="button"
                  id={`expression-${exp.value}`}
                  onClick={() => handleUpdate('expression', exp.value)}
                  className={`px-2 py-1 rounded-lg border text-[11px] font-medium transition-all ${config.expression === exp.value ? 'bg-orange-400 text-white border-orange-400 scale-105' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                >
                  {exp.name}
                </button>
              ))}
            </div>
          </div>

          {/* Accesorios: Lentes, Barba y Delantal */}
          <div className="pt-1">
            <span className="font-semibold text-gray-700 block mb-2">Accesorios</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="toggle-glasses"
                onClick={() => handleUpdate('glasses', !config.glasses)}
                className={`py-1.5 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${config.glasses ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
              >
                🤓 {config.glasses ? 'SÍ Lentes' : 'NO Lentes'}
              </button>

              <button
                type="button"
                id="toggle-beard"
                onClick={() => handleUpdate('beard', !config.beard)}
                className={`py-1.5 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${config.beard ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
              >
                🧔 {config.beard ? 'SÍ Barba' : 'NO Barba'}
              </button>

              <button
                type="button"
                id="toggle-apron"
                onClick={() => handleUpdate('hasApron', !config.hasApron)}
                className={`py-1.5 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${config.hasApron ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
              >
                🎽 {config.hasApron ? 'SÍ Delantal' : 'NO Delantal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
