// ============================================================
// firebase.js — Inicialización del Firebase JS SDK v9 (modular)
// ============================================================
//
// ⚠️  INSTRUCCIONES DE CONFIGURACIÓN:
//
//  1. Abre la Consola de Firebase: https://console.firebase.google.com
//  2. Ve a tu proyecto → Configuración del proyecto (engranaje) → General
//  3. En la sección "Tus apps" → SDK de Web, copia el objeto firebaseConfig
//  4. Reemplaza los valores de PLACEHOLDER_* a continuación con tus credenciales
//
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔑 Reemplaza estos valores con los de tu proyecto Firebase
const firebaseConfig = {
  apiKey:            "PLACEHOLDER_API_KEY",
  authDomain:        "PLACEHOLDER_PROJECT_ID.firebaseapp.com",
  projectId:         "PLACEHOLDER_PROJECT_ID",
  storageBucket:     "PLACEHOLDER_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "PLACEHOLDER_SENDER_ID",
  appId:             "PLACEHOLDER_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
