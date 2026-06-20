/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { dbAdapter } from './src/db';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Configure middlewaress
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initialize Gemini Client Lazily only when used!
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARN: GEMINI_API_KEY environment variable is not defined.");
    }
    // Setup server-side Gemini following @google/genai guidelines with 'aistudio-build' User-Agent
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'DUMMY_KEY_FOR_STARTUP_PREVENTION',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}


// API: REGISTER USER
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, phone, address } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Todos los campos obligatorios deben completarse' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await dbAdapter.getUser(normalizedEmail);

  if (existingUser) {
    return res.status(400).json({ message: 'La cuenta con este correo ya existe. Inicia sesión.' });
  }

  // Define default caricature avatar properties
  const defaultCaricature = {
    skinColor: "#f1c27d",
    hairStyle: "short",
    hairColor: "brown",
    eyeColor: "black",
    glasses: false,
    beard: false,
    expression: "happy",
    hasApron: false
  };

  const newUser = {
    email: normalizedEmail,
    password, // Store simply for local sandbox demo
    name,
    phone: phone || '',
    address: address || '',
    avatarUrl: '',
    caricature: defaultCaricature,
    totalScore: 0,
    currentLevel: 1,
    currentSteps: 0,
    completedLessons: []
  };

  await dbAdapter.createUser(newUser);

  // Return user without password
  const { password: _, ...safeUser } = newUser as any;
  res.json(safeUser);
});


// API: LOGIN USER
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Introduce correo y contraseña.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await dbAdapter.getUser(normalizedEmail);

  if (!existingUser || existingUser.password !== password) {
    return res.status(400).json({ message: 'Credenciales inválidas. Verifica tu correo u contraseña.' });
  }

  const { password: _, ...safeUser } = existingUser;
  res.json(safeUser);
});


// API: GOOGLE SIMULATED LOGIN
app.post('/api/auth/google-sim', async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({ message: 'Falta información de la cuenta de Google' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  let existingUser = await dbAdapter.getUser(normalizedEmail);

  if (!existingUser) {
    // Automatically register Google social credentials dynamically
    const defaultCaricature = {
      skinColor: "#ffdbac",
      hairStyle: "curly",
      hairColor: "black",
      eyeColor: "brown",
      glasses: false,
      beard: false,
      expression: "smiling",
      hasApron: false
    };

    existingUser = {
      email: normalizedEmail,
      password: "google-simulated-password-token",
      name,
      phone: '',
      address: '',
      avatarUrl: '',
      caricature: defaultCaricature,
      totalScore: 0,
      currentLevel: 1,
      currentSteps: 0,
      completedLessons: []
    };

    await dbAdapter.createUser(existingUser);
  }

  const { password: _, ...safeUser } = existingUser;
  res.json(safeUser);
});


// API: GET PUBLIC LEADERBOARD HISTORICAL
app.get('/api/leaderboard', async (req, res) => {
  const users = await dbAdapter.getAllUsers();
  // Map users to lists of entries sorted by totalScore descending
  const leaderboard = users
    .map((user: any) => ({
      name: user.name,
      email: user.email,
      totalScore: user.totalScore || 0,
      currentLevel: user.currentLevel || 1,
      currentSteps: user.currentSteps || 0,
      caricature: user.caricature
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  res.json(leaderboard);
});


// API: UPDATE USER PROFILE
app.post('/api/user/profile/update', async (req, res) => {
  const { email, name, phone, address, avatarUrl, caricature } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'No se identificó el email del usuario.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await dbAdapter.getUser(normalizedEmail);

  if (!user) {
    return res.status(444).json({ message: 'Usuario no encontrado.' });
  }

  const updates: any = {};
  if (name) updates.name = name;
  if (phone !== undefined) updates.phone = phone;
  if (address !== undefined) updates.address = address;
  if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;
  if (caricature !== undefined) updates.caricature = caricature;

  const updatedUser = await dbAdapter.updateUser(normalizedEmail, updates);

  const { password: _, ...safeUser } = updatedUser;
  res.json(safeUser);
});


// API: SUBMIT LESSON SCORE & UPDATE LEVEL PROGRESS
app.post('/api/user/score', async (req, res) => {
  const { email, scoreIncrement, stepsIncrement, lessonId, currentLevel } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'No se identificó el email del usuario.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await dbAdapter.getUser(normalizedEmail);

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado.' });
  }

  const updates: any = {};
  // Update totalScore
  updates.totalScore = (user.totalScore || 0) + (scoreIncrement || 0);
  
  // Update totalCompletedSteps
  updates.currentSteps = (user.currentSteps || 0) + (stepsIncrement || 0);

  // Set currentLevel
  if (currentLevel && currentLevel > (user.currentLevel || 1)) {
    updates.currentLevel = currentLevel;
  }

  // Cache completed lessons
  if (lessonId) {
    const list = user.completedLessons ? [...user.completedLessons] : [];
    if (!list.includes(lessonId)) {
      list.push(lessonId);
    }
    updates.completedLessons = list;
  }

  const updatedUser = await dbAdapter.updateUser(normalizedEmail, updates);

  const { password: _, ...safeUser } = updatedUser;
  res.json(safeUser);
});


// API: EXTREMELY COOL GEMINI CARICATURIZER ENDPOINT
app.post('/api/caricaturize', async (req, res) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ message: 'Foto de rostro no encontrada.' });
  }

  try {
    // 1. Process base64 parsing manually
    // E.g.: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD..."
    let cleanBase64 = image;
    let mimeType = 'image/jpeg';

    if (image.includes(';base64,')) {
      const parts = image.split(';base64,');
      mimeType = parts[0].replace('data:', '');
      cleanBase64 = parts[1];
    }

    // Checking if api key exists
    if (!process.env.GEMINI_API_KEY) {
      console.warn("Falling back to simulated caricaturize due to missing GEMINI_API_KEY.");
      throw new Error("Missing GEMINI_API_KEY");
    }

    // 2. Call new GoogleGenAI SDK in model gemini-3.5-flash
    const ai = getGemini();
    const result = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        {
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType
          }
        },
        `Analiza la foto de rostro de este usuario en detalle y traduce sus características físicas para configurar nuestro avatar de caricatura. Debes aproximar la respuesta de forma creativa y amigable.
        
        Devuelve ESTRICTAMENTE un objeto JSON con este formato (no agregues carátulas, explicaciones de texto, comillas de markdown " \`\`\`json ", responde SÓLO la sintaxis JSON cruda y procesable):
        
        {
          "skinColor": "#ffdbac" o "#f1c27d" o "#e0ac69" o "#c68642" o "#8d5524",
          "hairStyle": "short" o "curly" o "long" o "bald" o "spiky" o "wavy",
          "hairColor": "black" o "brown" o "blonde" o "red" o "gray",
          "eyeColor": "black" o "blue" o "green" o "brown",
          "glasses": true (si tiene anteojos puestos o lentes sutiles) o false,
          "beard": true (si tiene barba, bigote largo o perilla) o false,
          "expression": "happy" o "neutral" o "smiling" o "surprised"
        }`
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const aiText = result.text;
    if (!aiText) {
      throw new Error("No response from Gemini");
    }

    // Strip out potentially returned markdown boxes: e.g. ```json ... ```
    let cleanJsonStr = aiText.trim();
    if (cleanJsonStr.startsWith('```')) {
      cleanJsonStr = cleanJsonStr.replace(/^```(json)?/, '').replace(/```$/, '').trim();
    }

    const characteristics = JSON.parse(cleanJsonStr);
    return res.json(characteristics);

  } catch (err: any) {
    console.error("Gemini Caricaturize failed, serving funny random matching cartoon profile:", err);
    
    // Smooth fallback configurations so the app NEVER fails for the user!
    const hairOptions = ['short', 'curly', 'long', 'spiky', 'wavy'];
    const colorOptions = ['black', 'brown', 'blonde', 'red', 'gray'];
    const eyeOptions = ['black', 'blue', 'green', 'brown'];
    const skinOptions = ['#ffdbac', '#f1c27d', '#e0ac69', '#c68642'];

    const fallbackCaricature = {
      skinColor: skinOptions[Math.floor(Math.random() * skinOptions.length)],
      hairStyle: hairOptions[Math.floor(Math.random() * hairOptions.length)],
      hairColor: colorOptions[Math.floor(Math.random() * colorOptions.length)],
      eyeColor: eyeOptions[Math.floor(Math.random() * eyeOptions.length)],
      glasses: Math.random() > 0.5,
      beard: Math.random() > 0.6,
      expression: 'smiling'
    };

    return res.json(fallbackCaricature);
  }
});


// Setup Vite Dev server or Serve compiled static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.error("[Server] Failed to load Vite development server:", err);
    }
  } else if (!process.env.VERCEL) {
    let distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(path.join(distPath, 'index.html'))) {
      distPath = __dirname;
    }
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Always listen in standard container or Cloud Run setups
  const shouldListen = !process.env.VERCEL || !!process.env.PORT || !!process.env.K_SERVICE || !!process.env.CONTAINER_SANDBOX;
  if (shouldListen) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[La Verdu Server] Running on http://0.0.0.0:${PORT}`);
    });
  }
}

startServer();

export default app;
