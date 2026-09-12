// ============================================================
// auth.js — Módulo de Autenticación con Firebase Auth SDK v9
// ============================================================

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { auth, db } from "./firebase.js";

// ─── Iniciar sesión ───────────────────────────────────────────────────────────
export async function signIn(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

// ─── Registrar nuevo usuario ──────────────────────────────────────────────────
export async function register(email, password, username) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;

  // Guardar nombre de usuario en Firestore (mismo path que en el original Python)
  await setDoc(doc(db, "usuarios", uid), {
    email,
    nombre_usuario: username,
  });

  return credential.user;
}

// ─── Cerrar sesión ────────────────────────────────────────────────────────────
export async function logout() {
  await signOut(auth);
}

// ─── Obtener nombre del usuario ───────────────────────────────────────────────
export async function getUserName(uid) {
  const snap = await getDoc(doc(db, "usuarios", uid));
  if (snap.exists()) {
    return snap.data().nombre_usuario || "Usuario";
  }
  return "Usuario";
}

// ─── Listener de autenticación ────────────────────────────────────────────────
// Llama al callback con `user` (si logueado) o `null` (si no)
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
