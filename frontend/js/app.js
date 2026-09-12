// ============================================================
// app.js — Orquestador Principal
// ============================================================

import { auth } from './api.js';
import * as ui from './ui.js';

// ─── Eventos de Autenticación (Login / Registro) ────────────────────────────

const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const authTabs = document.querySelectorAll('.auth-tab');

// Manejar Tabs de Login/Registro
authTabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    // Quitar active de tabs y forms
    authTabs.forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    // Activar seleccionada
    e.target.classList.add('active');
    document.getElementById(e.target.dataset.target).classList.add('active');
  });
});

// Submit Login
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-password').value;
  
  try {
    const user = await auth.login(email, pass);
    ui.showToast('¡Bienvenido de nuevo!');
    initializeApp(user);
  } catch(err) {
    ui.showToast(err.message, 'error');
  }
});

// Submit Registro
formRegister.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const pass = document.getElementById('reg-password').value;
  
  try {
    const user = await auth.register(email, pass, name);
    ui.showToast('¡Cuenta creada y logueado!');
    initializeApp(user);
  } catch(err) {
    ui.showToast(err.message, 'error');
  }
});

// Función de Logout
async function handleLogout() {
  auth.logout();
  ui.showAuthView();
}


// ─── Eventos de la App Principal ─────────────────────────────────────────────

// Formulario nueva transacción
document.getElementById('form-transaction').addEventListener('submit', ui.handleTransactionSubmit);

// Eliminar transacciones
document.getElementById('btn-delete-selected').addEventListener('click', ui.handleDeleteSelected);


// ─── Flujo de Inicio ────────────────────────────────────────────────────────
function initializeApp(user) {
  // Configurar UI con el usuario logueado e iniciar router
  ui.initUI(user, handleLogout);
}

// Comprobar sesión al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  const user = auth.getCurrentUser();
  
  if (user) {
    initializeApp(user);
  } else {
    ui.showAuthView();
  }
});
