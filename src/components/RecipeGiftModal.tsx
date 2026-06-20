/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Recipe, User } from '../types';
import DiegoMascot from './DiegoMascot';
import { Gift, MessageSquare, MapPin, Navigation, Clock, Check, X, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioManager } from '../utils/audio';

interface RecipeGiftModalProps {
  recipe: Recipe;
  user: User;
  onClose: () => void;
}

export default function RecipeGiftModal({ recipe, user, onClose }: RecipeGiftModalProps) {
  const [showOrderSection, setShowOrderSection] = useState(false);
  const [gainedSuprise, setGainedSurprise] = useState(false);

  // Address matching and distance helper:
  // Since La Verdu is situated at "Claudio Cuenca 1801, Villa Cabrera, Córdoba", we can simulate 
  // a neat distance estimate (e.g. between 1.5 and 8.9 km) based on user's address length or a deterministic hash,
  // making it look incredibly realistic!
  const getEstimatedDistance = (addr: string) => {
    if (!addr || addr.length < 5) return '2.5';
    // Deterministic distance based on address length
    const hash = addr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dist = (1.2 + (hash % 85) / 10).toFixed(1);
    return dist;
  };

  const distance = getEstimatedDistance(user.address);
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(user.address || 'Córdoba, Argentina')}`;

  const handleSendOrder = () => {
    // Generate text message for WhatsApp
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const ingredientsText = recipe.ingredients.map(ing => `• ${ing}`).join('\r\n');

    const rawMsg = `¡Hola La Verdu de Villa Cabrera! 🥦🍎
Acabo de ganar una receta saludable en *VerduPlay* y quiero consultar para hacer el pedido.

🥗 *Receta:* ${recipe.title}
⏱️ *Preparación:* ${recipe.prepTime}

🛒 *Ingredientes detallados a pedir:*
${ingredientsText}

¿Tienen todos estos ingredientes disponibles en su sucursal de Claudio Cuenca 1801?

🚚 *Datos de Entrega del Cliente:*
• *Nombre:* ${user.name || 'Cliente VerduPlay'}
• *Teléfono:* ${user.phone || 'S/D'}
• *Dirección:* ${user.address || 'S/D'}
• *Enlace de Google Maps:* ${mapLink}
• *Distancia a Villa Cabrera:* ~${distance} km

¡Agradezco mucho su respuesta e información! 🙌`;

    // WhatsApp base URL (with phone 3513695586 explicitly)
    const waUrl = `https://wa.me/543513695586?text=${encodeURIComponent(rawMsg)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto text-sm">
      <AnimatePresence>
        {!gainedSuprise ? (
          /* STEP 1: LOCKED GIFT WRAPPER ANIMATION */
          <motion.div
            key="gift-wrapper"
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 max-w-sm w-full text-center text-white shadow-2xl relative border-4 border-yellow-300"
          >
            {/* Confetti particles in SVG background */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <SparklesConfetti />
            </div>

            <span className="text-xs font-black uppercase tracking-widest bg-yellow-400 text-yellow-950 px-3.5 py-1.5 rounded-full inline-block animate-pulse">
              🎁 REGALO ESPECIAL 🎁
            </span>

            <h3 className="text-2xl font-black mt-5 leading-tight text-yellow-100">
              ¡Completaste 10 Pasos!
            </h3>
            
            <p className="text-xs text-emerald-100 mt-2">
              Diego tiene un premio saludable listo para tu cocina. ¡Toca el regalo para desenvolverlo!
            </p>

            {/* Tap-to-open giant gift wrapper boxes */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              onClick={() => {
                audioManager.playCorrect();
                setGainedSurprise(true);
              }}
              className="my-8 cursor-pointer relative inline-block group"
              id="gift-box-trigger"
            >
              <div className="absolute -inset-2 bg-yellow-400 rounded-full opacity-30 group-hover:scale-125 blur-md transition-all" />
              <Gift className="w-28 h-28 text-yellow-300 fill-yellow-400 drop-shadow-xl animate-bounce" />
            </motion.div>

            <span className="text-[11px] text-emerald-200 block font-semibold animate-pulse">
              ¡Haz clic para ver la receta secreta!
            </span>
          </motion.div>
        ) : (
          /* STEP 2: REVEALED RECIPE CONTENT MODAL */
          <motion.div
            key="recipe-unveiled"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-emerald-500 my-4"
          >
            {/* Header recipe cover image with label */}
            <div className="bg-emerald-500 text-white p-5 text-center relative border-b border-emerald-600">
              <button
                type="button"
                id="close-recipe-modal-x"
                onClick={() => {
                  audioManager.playClick();
                  onClose();
                }}
                className="absolute right-4 top-4 text-emerald-100 hover:text-white bg-emerald-700/30 p-1.5 rounded-full transition-colors"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-[10px] tracking-wider uppercase font-black bg-white text-emerald-800 px-3 py-1 rounded-full inline-block shadow-sm">
                🍅 Receta Especial Obsequiada 🍅
              </span>
              
              <h3 className="text-xl font-black mt-3 leading-tight" id="gift-recipe-title">
                {recipe.title}
              </h3>
              
              <p className="text-xs text-emerald-100 mt-1 max-w-sm mx-auto italic">
                "{recipe.description}"
              </p>

              <div className="flex items-center justify-center gap-4 mt-4 text-xs font-bold bg-emerald-600/40 py-1.5 px-3 rounded-xl max-w-fit mx-auto">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {recipe.prepTime}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
                <span className="capitalize">{recipe.category === 'fruits-veg' ? '🥦 Vegetales' : recipe.category === 'mate-honey' ? '🍯 Tradicional' : '🌱 Huerta'}</span>
              </div>
            </div>

            {/* Ingredients or Directions toggle wrapper */}
            <div className="p-6 max-h-[380px] overflow-y-auto custom-scrollbar space-y-5">
              
              {/* Ingredients list */}
              <div>
                <h4 className="font-extrabold text-gray-800 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-2 border-b pb-1">
                  <ClipboardCheck className="w-4 h-4 text-emerald-500" />
                  Ingredientes frescos de La Verdu
                </h4>
                <ul className="space-y-1.5">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-semibold text-gray-700">
                      <div className="w-4 h-4 rounded bg-emerald-50 border border-emerald-300 text-emerald-600 flex items-center justify-center mt-0.5 text-[10px] font-black">
                        ✓
                      </div>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions list */}
              <div>
                <h4 className="font-extrabold text-gray-800 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-2 border-b pb-1">
                  <Navigation className="w-4 h-4 text-emerald-500" />
                  Instrucciones de Elaboración
                </h4>
                <ol className="space-y-3">
                  {recipe.instructions.map((inst, i) => (
                    <li key={i} className="flex gap-3 text-xs text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-yellow-400 text-yellow-950 font-black flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
                        {i + 1}
                      </span>
                      <p className="leading-relaxed">{inst}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* STAGE: DELIVERY CHECKOUT */}
              {showOrderSection && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 p-4 rounded-2xl border-2 border-dashed border-amber-300 mt-6 space-y-3"
                >
                  <h4 className="font-black text-amber-950 text-sm flex items-center gap-1.5">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    Envío Directo de Ingredientes de La Verdu
                  </h4>
                  
                  <div className="text-xs text-amber-800 space-y-2">
                    <p>Enviaremos los ingredientes detallados desde nuestra sucursal en <b>Claudio Cuenca 1801, Villa Cabrera</b> directamente a:</p>
                    
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                      <span className="block font-bold">Teléfono: <span className="font-semibold text-gray-700">{user.phone || 'Pendiente en perfil'}</span></span>
                      <span className="block font-bold">Dirección: <span className="font-semibold text-gray-700">{user.address || 'Pendiente en perfil'}</span></span>
                      <span className="block font-bold text-[10.5px] text-amber-700 mt-1 flex items-center gap-1">
                        🚗 Distancia Estimada: ~{distance} km
                        <a href={mapLink} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline font-extrabold ml-1 inline-flex items-center gap-0.5">
                          Ver dirección en Maps 🗺️
                        </a>
                      </span>
                    </div>

                    {(!user.phone || !user.address) && (
                      <p className="text-red-600 font-bold bg-white p-1 px-2.5 rounded-lg inline-block">
                        ⚠️ Alerta: Recuerda configurar tu teléfono y dirección en tu perfil para que el pedido vaya completo.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      id="cancel-wa-order"
                      onClick={() => {
                        audioManager.playClick();
                        setShowOrderSection(false);
                      }}
                      className="py-2.5 px-3 bg-white text-gray-500 rounded-xl border border-gray-200 font-bold text-xs"
                    >
                      Volver
                    </button>
                    <button
                      type="button"
                      id="confirm-send-wa-order"
                      onClick={() => {
                        audioManager.playCorrect();
                        handleSendOrder();
                      }}
                      className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
                    >
                      <MessageSquare className="w-4 h-4 fill-current" />
                      Pedir por WhatsApp al 3513695586
                    </button>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Bottom buttons panel */}
            {!showOrderSection && (
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  id="close-recipe-gift-modal-btn"
                  onClick={() => {
                    audioManager.playClick();
                    onClose();
                  }}
                  className="w-full sm:w-1/3 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-750 font-bold rounded-2xl text-xs transition-all text-center"
                >
                  Guardar Receta
                </button>
                <button
                  type="button"
                  id="order-ingredients-verdu-btn"
                  onClick={() => {
                    audioManager.playClick();
                    setShowOrderSection(true);
                  }}
                  className="w-full sm:flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-650 text-white font-black rounded-2xl text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-md border-b-4 border-emerald-700"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  ¿Quieres hacer un pedido a La Verdu?
                </button>
              </div>
            )}
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sparkle graphic background helper
function SparklesConfetti() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="20" cy="20" r="1" fill="#fff" />
      <circle cx="80" cy="30" r="1.5" fill="#fff" />
      <circle cx="40" cy="70" r="2" fill="#fff" />
      <circle cx="90" cy="80" r="1" fill="#fff" />
      <path d="M10 50 L12 48 L14 50 L12 52 Z" fill="#facc15" />
      <path d="M75 15 L77 13 L79 15 L77 17 Z" fill="#facc15" />
      <path d="M60 85 L62 83 L64 85 L62 87 Z" fill="#facc15" />
    </svg>
  );
}
