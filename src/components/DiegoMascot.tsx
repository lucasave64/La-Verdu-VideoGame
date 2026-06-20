/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface DiegoMascotProps {
  mood?: 'happy' | 'neutral' | 'sad' | 'surprised' | 'teaching';
  bubbleText?: string | React.ReactNode;
  bubblePosition?: 'top' | 'right' | 'left' | 'bottom';
  className?: string;
  size?: number;
}

export default function DiegoMascot({
  mood = 'neutral',
  bubbleText,
  bubblePosition = 'right',
  className = '',
  size = 140
}: DiegoMascotProps) {

  // Setup specifications based on Diego's description: short brown hair, glasses, Verdu apron
  const hairHex = '#5c4033'; // short brown hair
  const skinColor = '#f1c27d'; // warm skin tone

  const getMouthPath = () => {
    switch (mood) {
      case 'happy':
      case 'teaching':
        return (
          <g>
            {/* Wide smiling mouth with teeth */}
            <path d="M85 94 C85 106, 115 106, 115 94 Z" fill="#6b21a8" />
            <path d="M85 94 C90 97, 110 97, 115 94 Z" fill="white" />
            <path d="M92 101 C95 103, 105 103, 108 101 Z" fill="#f43f5e" />
          </g>
        );
      case 'surprised':
        return <circle cx="100" cy="98" r="6" fill="#6b21a8" />;
      case 'sad':
        return <path d="M90 102 C95 98, 105 98, 110 102" stroke="#4a154b" strokeWidth="3" strokeLinecap="round" fill="none" />;
      case 'neutral':
      default:
        return <path d="M90 97 C95 95, 105 95, 110 97" stroke="#4a154b" strokeWidth="2.5" strokeLinecap="round" fill="none" fillOpacity="0" />;
    }
  };

  const getEyebrows = () => {
    switch (mood) {
      case 'surprised':
        return (
          <g>
            {/* High arched brows */}
            <path d="M76 68 C80 62, 90 64, 91 67" stroke={hairHex} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M124 68 C120 62, 110 64, 109 67" stroke={hairHex} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>
        );
      case 'sad':
        return (
          <g>
            {/* Worried tilted eyebrows */}
            <path d="M78 72 C82 74, 90 73, 92 70" stroke={hairHex} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M122 72 C118 74, 110 73, 108 70" stroke={hairHex} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>
        );
      case 'happy':
      case 'teaching':
      case 'neutral':
      default:
        return (
          <g>
            <path d="M77 71 C81 68, 89 69, 91 72" stroke={hairHex} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M123 71 C119 68, 111 69, 109 72" stroke={hairHex} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>
        );
    }
  };

  const bubbleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } }
  };

  const containerDirection = bubblePosition === 'left' ? 'flex-row-reverse' : bubblePosition === 'top' ? 'flex-col-reverse' : bubblePosition === 'bottom' ? 'flex-col' : 'flex-row';

  return (
    <div className={`flex items-center gap-4 ${containerDirection} ${className}`}>
      {/* DIEGO MASCOT VECTOR COMPONENT */}
      <motion.div 
        className="relative select-none"
        style={{ width: size, height: size }}
        animate={{ 
          y: mood === 'happy' ? [0, -6, 0] : [0, -3, 0],
          rotate: mood === 'teaching' ? [0, 1, -1, 0] : 0
        }}
        transition={{ 
          repeat: Infinity, 
          duration: mood === 'happy' ? 2 : 4, 
          ease: 'easeInOut' 
        }}
      >
        <svg 
          viewBox="0 0 200 200" 
          className="w-full h-full drop-shadow-lg"
          id="mascot-diego-svg"
        >
          {/* Defs */}
          <defs>
            <radialGradient id="diego-face-grad" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#000" stopOpacity={0.06} />
            </radialGradient>
            <clipPath id="diego-body-clip">
              <circle cx="100" cy="100" r="95" />
            </clipPath>
          </defs>

          {/* Halo background circle representing La Verdu color */}
          <circle cx="100" cy="100" r="95" fill="#f0edf2" stroke="#eab308" strokeWidth="2" opacity="0.4" />
          
          <g clipPath="url(#diego-body-clip)">
            {/* DIEGO'S GREEN APRON BODY */}
            <g id="diego-body">
              {/* Shoulders */}
              <path d="M40 200 C40 160, 60 142, 100 142 C140 142, 160 160, 160 200 Z" fill="#15803d" />
              {/* Blue T-shirt sleeves showing slightly underneath (from real photo) */}
              <path d="M40 200 C37 178, 41 162, 54 154" stroke="#3b82f6" strokeWidth="11" strokeLinecap="round" />
              <path d="M160 200 C163 178, 159 162, 146 154" stroke="#3b82f6" strokeWidth="11" strokeLinecap="round" />
              
              {/* Apron bib / front straps */}
              <path d="M68 142 L132 142 L120 115 L80 115 Z" fill="#166534" />
              {/* Strap connections */}
              <path d="M80 115 L74 105" stroke="#ca8a04" strokeWidth="4.5" />
              <path d="M120 115 L126 105" stroke="#ca8a04" strokeWidth="4.5" />
              
              {/* LA VERDU Logo on Apron */}
              <ellipse cx="100" cy="164" rx="25" ry="16" fill="white" stroke="#eab308" strokeWidth="2" />
              <text x="100" y="162" fill="#15803d" fontSize="7" fontWeight="bold" textAnchor="middle">LA VERDU</text>
              <text x="100" y="171" fill="#ca8a04" fontSize="4.5" textAnchor="middle">desde 1996</text>
            </g>

            {/* NECK */}
            <rect x="88" y="102" width="24" height="25" rx="5" fill={skinColor} />
            <rect x="88" y="108" width="24" height="19" fill="#000" opacity="0.1" />

            {/* EARS */}
            <circle cx="68" cy="85" r="10" fill={skinColor} />
            <circle cx="132" cy="85" r="10" fill={skinColor} />
            <circle cx="68" cy="85" r="6" fill="#000" opacity="0.08" />
            <circle cx="132" cy="85" r="6" fill="#000" opacity="0.08" />

            {/* FACE SHAPE */}
            <rect x="70" y="52" width="60" height="60" rx="24" fill={skinColor} />
            <rect x="70" y="52" width="60" height="60" rx="24" fill="url(#diego-face-grad)" />

            {/* HAIR - Short brown (Diego style from photo) */}
            <g id="diego-hair" fill={hairHex}>
              {/* Base hair volume */}
              <path d="M68 56 C72 38, 128 38, 132 56 C138 43, 118 32, 100 32 C82 32, 62 43, 68 56 C65 62, 69 68, 71 68 C71 68, 75 56, 80 56 L120 56 C125 56, 129 68, 129 68 C131 68, 135 62, 132 56 Z" />
              {/* Short neat sideburns */}
              <path d="M68 56 L68 70 L72 68 Z" />
              <path d="M132 56 L132 70 L128 68 Z" />
            </g>

            {/* EYES */}
            <circle cx="86" cy="77" r="7.5" fill="white" stroke="#ccc" strokeWidth="0.5" />
            <circle cx="114" cy="77" r="7.5" fill="white" stroke="#ccc" strokeWidth="0.5" />
            {/* Pupils */}
            <circle cx="86" cy="77" r="4.5" fill="#3e2723" />
            <circle cx="114" cy="77" r="4.5" fill="#3e2723" />
            {/* Eye reflection sparkles */}
            <circle cx="84" cy="75" r="1.5" fill="white" />
            <circle cx="112" cy="75" r="1.5" fill="white" />

            {/* EYEBROWS */}
            {getEyebrows()}

            {/* GLASSES (Diego has glasses) */}
            <g id="diego-glasses">
              {/* Left frame */}
              <circle cx="86" cy="77" r="12" stroke="#451a03" strokeWidth="3" fill="none" />
              {/* Right frame */}
              <circle cx="114" cy="77" r="12" stroke="#451a03" strokeWidth="3" fill="none" />
              {/* Connecting bridge */}
              <path d="M98 77 L102 77" stroke="#451a03" strokeWidth="3.5" />
              {/* Sides details */}
              <path d="M74 77 L68 74" stroke="#451a03" strokeWidth="2.5" />
              <path d="M126 77 L132 74" stroke="#451a03" strokeWidth="2.5" />
            </g>

            {/* NOSE */}
            <path d="M96 80 C96 76, 104 76, 104 80 C104 85, 96 85, 96 80 Z" fill="#000" opacity="0.1" />
            <path d="M97 79 C97 77, 103 77, 103 79 C103 83, 97 83, 97 79 Z" fill={skinColor} />

            {/* MOUTH BASED ON MOOD */}
            {getMouthPath()}

            {/* BLUSH CHEEKS */}
            <circle cx="78" cy="85" r="4.5" fill="#ef4444" opacity={mood === 'happy' ? 0.35 : 0.15} />
            <circle cx="122" cy="85" r="4.5" fill="#ef4444" opacity={mood === 'happy' ? 0.35 : 0.15} />
          </g>
        </svg>
      </motion.div>

      {/* SPEECH BUBBLE */}
      {bubbleText && (
        <motion.div
          id="mascot-speech-bubble"
          variants={bubbleVariants}
          initial="hidden"
          animate="visible"
          className={`relative max-w-xs bg-white text-gray-800 p-4 rounded-2xl shadow-xl border-2 border-emerald-400 font-sans ${
            bubblePosition === 'top'
              ? 'mb-2 origin-bottom'
              : bubblePosition === 'left'
              ? 'origin-right'
              : bubblePosition === 'bottom'
              ? 'mt-2 origin-top'
              : 'origin-left'
          }`}
        >
          {/* Triangle tail for speech bubble */}
          <div 
            className={`absolute w-3 h-3 bg-white border-b-2 border-r-2 border-emerald-400 transform rotate-45 ${
              bubblePosition === 'left'
                ? 'top-1/2 -right-2 -translate-y-1/2 border-t-2 border-r-2 border-b-0 border-l-0 rotate-45'
                : bubblePosition === 'top'
                ? 'bottom-[-7px] left-1/2 -translate-x-1/2 border-t-0 border-r-2 border-b-2 border-l-0 rotate-45'
                : bubblePosition === 'bottom'
                ? 'top-[-7px] left-1/2 -translate-x-1/2 border-t-2 border-r-0 border-b-0 border-l-2 rotate-45'
                : 'top-1/2 -left-2 -translate-y-1/2 border-t-0 border-r-0 border-b-2 border-l-2 rotate-45'
            }`}
          />
          <div className="text-sm font-medium leading-relaxed">
            {bubbleText}
          </div>
        </motion.div>
      )}
    </div>
  );
}
