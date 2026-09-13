// ============================================================
// app.js — Orquestador Principal
// ============================================================

import { auth } from './api.js';
import * as ui from './ui.js';

// ─── Eventos de Autenticación (Login / Registro) ────────────────────────────

const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const authTabs = document.querySelectorAll('.auth-tab');
const authTitleText = document.getElementById('auth-title-text');
const authSubtitleText = document.querySelector('.auth-subtitle-text');

// Manejar Tabs de Login/Registro de forma robusta
export function switchAuthTab(targetId) {
  authTabs.forEach(tab => {
    if (tab.dataset.target === targetId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  document.querySelectorAll('.auth-form').forEach(form => {
    if (form.id === targetId) {
      form.classList.add('active');
      form.style.display = 'block';
    } else {
      form.classList.remove('active');
      form.style.display = 'none';
    }
  });

  if (targetId === 'form-login') {
    if (authTitleText) authTitleText.textContent = 'Iniciar sesión';
    if (authSubtitleText) authSubtitleText.textContent = 'Ingresa a tu panel financiero en SIDAA';
  } else {
    if (authTitleText) authTitleText.textContent = 'Crear cuenta';
    if (authSubtitleText) authSubtitleText.textContent = 'Comienza a gestionar tus finanzas con SIDAA';
  }
}

authTabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = tab.dataset.target || (tab.getAttribute('data-target'));
    if (targetId) switchAuthTab(targetId);
  });
});

// Inicializar por defecto en Login ocultando Registro
switchAuthTab('form-login');

// Submit Login
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  const rememberCheckbox = document.getElementById('login-remember');
  const rememberMe = rememberCheckbox ? rememberCheckbox.checked : false;

  const submitBtn = formLogin.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Verificando...';
  
  try {
    const user = await auth.login(emailInput.value, passInput.value, rememberMe);
    ui.showToast(`¡Bienvenido de nuevo, ${user.username || 'Usuario'}! 👋`);
    initializeApp(user);
  } catch(err) {
    ui.showToast(err.message || 'Credenciales inválidas', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// Submit Registro (Guarda en la base de datos y redirige a login para verificar credenciales)
formRegister.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const passInput = document.getElementById('reg-password');
  const submitBtn = formRegister.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  const registeredEmail = emailInput.value.trim().toLowerCase();

  submitBtn.disabled = true;
  submitBtn.textContent = 'Registrando en BD...';
  
  try {
    await auth.register(registeredEmail, passInput.value, nameInput.value);
    ui.showToast('✅ ¡Cuenta creada con éxito en la base de datos! Inicia sesión para continuar.');
    
    // Limpiar formulario de registro
    formRegister.reset();

    // Cambiar automáticamente a la pestaña de Login
    switchAuthTab('form-login');

    // Pre-llenar el correo en el formulario de Login y enfocar contraseña
    const loginEmail = document.getElementById('login-email');
    const loginPass = document.getElementById('login-password');
    if (loginEmail) loginEmail.value = registeredEmail;
    if (loginPass) {
      loginPass.value = '';
      loginPass.focus();
    }
  } catch(err) {
    ui.showToast(err.message || 'Error al registrar usuario', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// Función de Logout
async function handleLogout() {
  auth.logout();
  ui.showAuthView();
  ui.showToast('Has cerrado sesión correctamente');
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

// Comprobar sesión y tema al cargar la página
window.addEventListener('DOMContentLoaded', async () => {
  // 1. Inicializar tema visual guardado
  ui.initTheme();

  // 2. Verificar sesión activa con el backend
  const user = await auth.verifySession();
  
  if (user) {
    initializeApp(user);
  } else {
    ui.showAuthView();
  }
});
