/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  collection 
} from 'firebase/firestore';

// Fallback JSON-file database config
let DATA_DIR = path.join(process.cwd(), 'data');
if (process.env.VERCEL || process.env.NOW_BUILDER) {
  DATA_DIR = '/tmp';
}

let DB_FILE = path.join(DATA_DIR, 'db.json');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn("[Database] Could not create DATA_DIR, falling back to /tmp:", e);
  DATA_DIR = '/tmp';
  DB_FILE = path.join(DATA_DIR, 'db.json');
}

const DEFAULT_LEADERBOARD = [
  {
    name: "Claudio Cabrera",
    email: "claudio@laverdu.com",
    totalScore: 540,
    currentLevel: 3,
    currentSteps: 23,
    completedLessons: ["level1-lesson1", "level1-lesson2"],
    caricature: {
      skinColor: "#e0ac69",
      hairStyle: "short",
      hairColor: "brown",
      eyeColor: "brown",
      glasses: true,
      beard: true,
      expression: "smiling",
      hasApron: true
    }
  },
  {
    name: "Sofi Huerta",
    email: "sofi.huertitas@gmail.com",
    totalScore: 420,
    currentLevel: 2,
    currentSteps: 18,
    completedLessons: ["level1-lesson1"],
    caricature: {
      skinColor: "#ffdbac",
      hairStyle: "long",
      hairColor: "blonde",
      eyeColor: "green",
      glasses: false,
      beard: false,
      expression: "happy",
      hasApron: false
    }
  },
  {
    name: "Mateo Piporé",
    email: "mate.pipore@misiones.com",
    totalScore: 310,
    currentLevel: 2,
    currentSteps: 11,
    completedLessons: [],
    caricature: {
      skinColor: "#c68642",
      hairStyle: "curly",
      hairColor: "black",
      eyeColor: "black",
      glasses: false,
      beard: true,
      expression: "smiling",
      hasApron: false
    }
  },
  {
    name: "Diego El Presentador",
    email: "diego@laverdu.com",
    totalScore: 280,
    currentLevel: 1,
    currentSteps: 10,
    completedLessons: [],
    caricature: {
      skinColor: "#f1c27d",
      hairStyle: "short",
      hairColor: "brown",
      eyeColor: "brown",
      glasses: true,
      beard: false,
      expression: "happy",
      hasApron: true
    }
  },
  {
    name: "Mariana Miel",
    email: "mariana.dulce@yahoo.com",
    totalScore: 190,
    currentLevel: 1,
    currentSteps: 8,
    completedLessons: [],
    caricature: {
      skinColor: "#ffdbac",
      hairStyle: "wavy",
      hairColor: "red",
      eyeColor: "blue",
      glasses: true,
      beard: false,
      expression: "smiling",
      hasApron: false
    }
  }
];

// Initialize Firestore first if credentials are available
let firestoreDb: any = null;
const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');

const isFirebaseDisabled = process.env.DISABLE_FIREBASE === 'true' || !!process.env.VERCEL;

if (fs.existsSync(firebaseConfigPath) && !isFirebaseDisabled) {
  try {
    const raw = fs.readFileSync(firebaseConfigPath, 'utf-8');
    const firebaseConfigObj = JSON.parse(raw);
    
    if (firebaseConfigObj && firebaseConfigObj.apiKey) {
      // Initialize Firebase standard client SDK for runtime communication
      const appInst = getApps().length === 0 ? initializeApp(firebaseConfigObj) : getApp();
      if (firebaseConfigObj.firestoreDatabaseId) {
        firestoreDb = getFirestore(appInst, firebaseConfigObj.firestoreDatabaseId);
      } else {
        firestoreDb = getFirestore(appInst);
      }
      console.log("[Database] Primary Firestore connection activated for project:", firebaseConfigObj.projectId, "DB ID:", firebaseConfigObj.firestoreDatabaseId || 'default');
    }
  } catch (err) {
    console.error("[Database] Error reading or initializing Firebase config:", err);
  }
}

// Initialize secondary PostgreSQL database pool if url is provided
let pool: pg.Pool | null = null;
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';

if (dbUrl && !firestoreDb) {
  console.log("[Database] Secondary Mode: DATABASE_URL detected. Configuring PostgreSQL pool...");
  pool = new pg.Pool({
    connectionString: dbUrl,
    ssl: dbUrl.includes('localhost') ? false : { rejectUnauthorized: false }
  });
}

if (!firestoreDb && !pool) {
  console.log("[Database] Sandbox Mode: Running with file-based persistence (db.json).");
}

// Ensure database table exists when using PostgreSQL
let initializedDb = false;
async function ensureTables() {
  if (!pool || initializedDb) return;
  initializedDb = true;

  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS la_verdu_users (
        email VARCHAR(255) PRIMARY KEY,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT DEFAULT '',
        address TEXT DEFAULT '',
        avatar_url TEXT DEFAULT '',
        caricature JSONB,
        total_score INTEGER DEFAULT 0,
        current_level INTEGER DEFAULT 1,
        current_steps INTEGER DEFAULT 0,
        completed_lessons JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const res = await client.query('SELECT COUNT(*) FROM la_verdu_users');
    const count = parseInt(res.rows[0].count, 10);
    if (count === 0) {
      console.log("[Database] Seeding initial La Verdu leaderboard users into PostgreSQL...");
      for (const u of DEFAULT_LEADERBOARD) {
        await client.query(`
          INSERT INTO la_verdu_users 
          (email, password, name, phone, address, avatar_url, caricature, total_score, current_level, current_steps, completed_lessons)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          u.email,
          "seeded-mock-pass-1234",
          u.name,
          "+543513695586",
          "Claudio Cuenca 1801, Villa Cabrera, Córdoba",
          "",
          JSON.stringify(u.caricature),
          u.totalScore,
          u.currentLevel,
          u.currentSteps,
          JSON.stringify(u.completedLessons)
        ]);
      }
    }
  } catch (error) {
    console.error("[Database] Error establishing PostgreSQL schema:", error);
  } finally {
    client.release();
  }
}

// Local JSON File Helper functions with in-memory fallback
let inMemoryDbCache: any = null;

function getLocalDb() {
  if (inMemoryDbCache) {
    return inMemoryDbCache;
  }

  const initialDb = { users: {} as any };
  DEFAULT_LEADERBOARD.forEach(u => {
    initialDb.users[u.email.toLowerCase().trim()] = {
      ...u,
      password: "seeded-mock-pass-1234",
      phone: "+543513695586",
      address: "La Verdu central shop, Villa Cabrera, Córdoba",
      avatarUrl: ""
    };
  });

  if (!fs.existsSync(DB_FILE)) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    } catch (e) {
      console.warn("[Database] Could not write initial db file, using memory only:", e);
    }
    inMemoryDbCache = initialDb;
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    inMemoryDbCache = JSON.parse(raw);
    return inMemoryDbCache;
  } catch (err) {
    console.error("[Database] Error reading local db, falling back to memory:", err);
    inMemoryDbCache = initialDb;
    return initialDb;
  }
}

function saveLocalDb(data: any) {
  inMemoryDbCache = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn("[Database] Error writing local db file (using memory cache):", err);
  }
}

// Helper to seed initial users in empty Firestore is empty
async function seedFirestoreIfNeeded() {
  if (!firestoreDb) return;
  try {
    const collSnap = await getDocs(collection(firestoreDb, 'la_verdu_users'));
    if (collSnap.empty) {
      console.log("[Database] Seeding initial users list into blank cloud Firestore...");
      for (const u of DEFAULT_LEADERBOARD) {
        const docRef = doc(firestoreDb, 'la_verdu_users', u.email.toLowerCase().trim());
        await setDoc(docRef, {
          ...u,
          password: "seeded-mock-pass-1234",
          phone: "+543513695586",
          address: "La Verdu central shop, Villa Cabrera, Córdoba",
          avatarUrl: ""
        });
      }
    }
  } catch (e) {
    console.warn("[Database] Attempted early seed warning (permissions or offline):", e);
  }
}

// Perform firestore background seeding
if (firestoreDb) {
  seedFirestoreIfNeeded();
}

// Consolidated Database Actions Adapter API
export const dbAdapter = {
  async getUser(email: string): Promise<any | null> {
    const cleanEmail = email.toLowerCase().trim();
    
    // 1. Primary DB: Firestore
    if (firestoreDb) {
      try {
        const docRef = doc(firestoreDb, 'la_verdu_users', cleanEmail);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data();
        }
        return null;
      } catch (err) {
        console.error("[Database] Failed to get user from Firebase Firestore:", err);
      }
    }

    // 2. Secondary DB: PostgreSQL
    if (pool) {
      await ensureTables();
      try {
        const res = await pool.query('SELECT * FROM la_verdu_users WHERE email = $1', [cleanEmail]);
        if (res.rows.length === 0) return null;
        const row = res.rows[0];
        return {
          email: row.email,
          password: row.password,
          name: row.name,
          phone: row.phone,
          address: row.address,
          avatarUrl: row.avatar_url,
          caricature: row.caricature,
          totalScore: row.total_score,
          currentLevel: row.current_level,
          currentSteps: row.current_steps,
          completedLessons: row.completed_lessons || []
        };
      } catch (err) {
        console.error("[Database] Failed to select user from Postgres:", err);
      }
    }

    // 3. Fallback DB: local json file
    const db = getLocalDb();
    return db.users[cleanEmail] || null;
  },

  async createUser(user: any): Promise<any> {
    const cleanEmail = user.email.toLowerCase().trim();

    // 1. Primary DB: Firestore
    if (firestoreDb) {
      try {
        const docRef = doc(firestoreDb, 'la_verdu_users', cleanEmail);
        await setDoc(docRef, user);
        return user;
      } catch (err) {
        console.error("[Database] Failed to create user in Firebase Firestore:", err);
      }
    }

    // 2. Secondary DB: PostgreSQL
    if (pool) {
      await ensureTables();
      try {
        await pool.query(`
          INSERT INTO la_verdu_users 
          (email, password, name, phone, address, avatar_url, caricature, total_score, current_level, current_steps, completed_lessons)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          cleanEmail,
          user.password || 'no-pass',
          user.name,
          user.phone || '',
          user.address || '',
          user.avatarUrl || '',
          JSON.stringify(user.caricature),
          user.totalScore || 0,
          user.currentLevel || 1,
          user.currentSteps || 0,
          JSON.stringify(user.completedLessons || [])
        ]);
        return user;
      } catch (err) {
        console.error("[Database] Failed to insert user into Postgres:", err);
      }
    }

    // 3. Fallback DB: local json file
    const db = getLocalDb();
    db.users[cleanEmail] = user;
    saveLocalDb(db);
    return user;
  },

  async updateUser(email: string, updates: any): Promise<any> {
    const cleanEmail = email.toLowerCase().trim();

    // 1. Primary DB: Firestore
    if (firestoreDb) {
      try {
        const docRef = doc(firestoreDb, 'la_verdu_users', cleanEmail);
        await setDoc(docRef, updates, { merge: true });
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
      } catch (err) {
        console.error("[Database] Failed to update user in Firebase Firestore:", err);
      }
    }

    // 2. Secondary DB: PostgreSQL
    if (pool) {
      await ensureTables();
      try {
        const keys = [];
        const values = [];
        let index = 1;

        if (updates.name !== undefined) {
          keys.push(`name = $${index++}`);
          values.push(updates.name);
        }
        if (updates.phone !== undefined) {
          keys.push(`phone = $${index++}`);
          values.push(updates.phone);
        }
        if (updates.address !== undefined) {
          keys.push(`address = $${index++}`);
          values.push(updates.address);
        }
        if (updates.avatarUrl !== undefined) {
          keys.push(`avatar_url = $${index++}`);
          values.push(updates.avatarUrl);
        }
        if (updates.caricature !== undefined) {
          keys.push(`caricature = $${index++}`);
          values.push(JSON.stringify(updates.caricature));
        }
        if (updates.totalScore !== undefined) {
          keys.push(`total_score = $${index++}`);
          values.push(updates.totalScore);
        }
        if (updates.currentLevel !== undefined) {
          keys.push(`current_level = $${index++}`);
          values.push(updates.currentLevel);
        }
        if (updates.currentSteps !== undefined) {
          keys.push(`current_steps = $${index++}`);
          values.push(updates.currentSteps);
        }
        if (updates.completedLessons !== undefined) {
          keys.push(`completed_lessons = $${index++}`);
          values.push(JSON.stringify(updates.completedLessons));
        }

        if (keys.length > 0) {
          values.push(cleanEmail);
          const query = `UPDATE la_verdu_users SET ${keys.join(', ')} WHERE email = $${index}`;
          await pool.query(query, values);
        }
        return await this.getUser(cleanEmail);
      } catch (err) {
        console.error("[Database] Failed to update user in Postgres:", err);
      }
    }

    // 3. Fallback DB: local json file
    const db = getLocalDb();
    if (db.users[cleanEmail]) {
      db.users[cleanEmail] = {
        ...db.users[cleanEmail],
        ...updates
      };
      saveLocalDb(db);
      return db.users[cleanEmail];
    }
    return null;
  },

  async getAllUsers(): Promise<any[]> {
    // 1. Primary DB: Firestore
    if (firestoreDb) {
      try {
        const collRef = collection(firestoreDb, 'la_verdu_users');
        const collSnap = await getDocs(collRef);
        const users: any[] = [];
        collSnap.forEach(dns => {
          users.push(dns.data());
        });
        if (users.length > 0) {
          return users;
        }
      } catch (err) {
        console.error("[Database] Failed to retrieve entries from Firebase Firestore:", err);
      }
    }

    // 2. Secondary DB: PostgreSQL
    if (pool) {
      await ensureTables();
      try {
        const res = await pool.query('SELECT * FROM la_verdu_users ORDER BY total_score DESC');
        return res.rows.map(row => ({
          email: row.email,
          name: row.name,
          phone: row.phone,
          address: row.address,
          avatarUrl: row.avatar_url,
          caricature: row.caricature,
          totalScore: row.total_score,
          currentLevel: row.current_level,
          currentSteps: row.current_steps,
          completedLessons: row.completed_lessons || []
        }));
      } catch (err) {
        console.error("[Database] Failed to fetch users list from Postgres:", err);
      }
    }

    // 3. Fallback DB: local json file
    const db = getLocalDb();
    return Object.values(db.users);
  }
};
