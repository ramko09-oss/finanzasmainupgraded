// ============================================================
// api.js — Cliente API para conectar con Node.js backend
// ============================================================

// Ruta relativa: funciona sin importar el puerto porque frontend y backend
// están en el mismo servidor (Express sirve ambos en puerto 3001)
const API_URL = '';

// ─── Configuración de Monedas ──────────────────────────────────────────────────
export const CURRENCIES = {
  USD: { symbol: "$",  name: "Dólar (USD)",         rate: 1.0   },
  EUR: { symbol: "€",  name: "Euro (EUR)",            rate: 0.92  },
  PEN: { symbol: "S/", name: "Sol (PEN)",             rate: 3.72  },
  MXN: { symbol: "$",  name: "Peso Mexicano (MXN)",   rate: 17.15 },
};

export function formatCurrency(amountUsd, currencyCode) {
  const currency = CURRENCIES[currencyCode] ?? CURRENCIES["USD"];
  const converted = amountUsd * currency.rate;
  return `${currency.symbol}${converted.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ─── Helpers de API ────────────────────────────────────────────────────────
export function getToken() {
  return sessionStorage.getItem('finanzas_jwt') || localStorage.getItem('finanzas_jwt');
}

export async function fetchAPI(endpoint, options = {}) {
  const { redirectOnAuthError = true, ...requestOptions } = options;
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...requestOptions.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...requestOptions,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Token expirado o inválido
      sessionStorage.removeItem('finanzas_jwt');
      sessionStorage.removeItem('finanzas_user');
      localStorage.removeItem('finanzas_jwt');
      localStorage.removeItem('finanzas_user');
      window.dispatchEvent(new Event('finanzas:session'));
      if (redirectOnAuthError) window.location.hash = '#auth';
    }
    const error = new Error(data.error || 'Error en la petición');
    error.status = response.status;
    throw error;
  }

  return data;
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export const auth = {
  async login(email, password, rememberMe = false) {
    const cleanEmail = email.trim().toLowerCase();
    const data = await fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: cleanEmail, password })
    });

    // Limpiar almacenamiento previo para evitar estados cruzados
    sessionStorage.removeItem('finanzas_jwt');
    sessionStorage.removeItem('finanzas_user');
    localStorage.removeItem('finanzas_jwt');
    localStorage.removeItem('finanzas_user');

    // Si 'Recordar sesión' está marcado, guardar en localStorage (permanente)
    // De lo contrario, guardar en sessionStorage (se cierra al salir del navegador)
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('finanzas_jwt', data.token);
    storage.setItem('finanzas_user', JSON.stringify(data.user));
    window.dispatchEvent(new Event('finanzas:session'));

    return data.user;
  },

  async register(email, password, username) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();
    const data = await fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: cleanEmail, password, username: cleanUsername })
    });
    return data;
  },

  logout() {
    sessionStorage.removeItem('finanzas_jwt');
    sessionStorage.removeItem('finanzas_user');
    localStorage.removeItem('finanzas_jwt');
    localStorage.removeItem('finanzas_user');
    window.dispatchEvent(new Event('finanzas:session'));
  },

  getCurrentUser() {
    const token = getToken();
    const userStr = sessionStorage.getItem('finanzas_user') || localStorage.getItem('finanzas_user');
    if (!token || !userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
};

// ─── Transacciones ──────────────────────────────────────────────────────────
export const db = {
  async getTransactions() {
    const data = await fetchAPI('/api/transactions');
    return normalizeTransactions(data);
  },

  async addTransaction({ tipo, montoLocal, descripcion, fecha, currencyCode }) {
    const currency = CURRENCIES[currencyCode] ?? CURRENCIES["USD"];
    const montoUsd = montoLocal / currency.rate;

    return fetchAPI('/api/transactions', {
      method: 'POST',
      body: JSON.stringify({
        tipo,
        monto: montoUsd,
        descripcion,
        fecha
      })
    });
  },

  async deleteTransaction(id) {
    return fetchAPI(`/api/transactions/${id}`, {
      method: 'DELETE'
    });
  }
};

// ─── Utilidades Analíticas (movidas desde el anterior db.js) ────────────────
export function normalizeTransactions(rows) {
  if (!Array.isArray(rows)) throw new Error('La respuesta de transacciones no es válida.');
  return rows.map(row => {
    const monto = Number(row.monto);
    const date = String(row.fecha).slice(0, 10);
    const fecha = new Date(`${date}T12:00:00`);
    const [year, month, day] = date.split('-').map(Number);
    if (!Number.isFinite(monto) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(fecha.getTime()) || fecha.getFullYear() !== year || fecha.getMonth() + 1 !== month || fecha.getDate() !== day) {
      throw new Error('Hay una transacción con importe o fecha inválidos.');
    }
    return { ...row, monto, fecha };
  });
}

export function calcMetrics(transactions) {
  const totalIngresos = transactions.filter(t => t.tipo === "Ingreso").reduce((s, t) => s + t.monto, 0);
  const totalGastos = transactions.filter(t => t.tipo === "Gasto").reduce((s, t) => s + t.monto, 0);

  return {
    totalIngresos,
    totalGastos,
    saldoTotal: totalIngresos - totalGastos,
    totalTransacciones: transactions.length,
  };
}

export function filterByMonth(transactions, year, month) {
  return transactions.filter(t => {
    const d = t.fecha;
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

export function groupByMonth(transactions) {
  const map = {};
  transactions.forEach(t => {
    const d = t.fecha;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!map[key]) map[key] = { mes: key, Ingreso: 0, Gasto: 0 };
    map[key][t.tipo] += t.monto;
  });
  return Object.values(map).sort((a, b) => a.mes.localeCompare(b.mes));
}

export function getAvailableMonths(transactions) {
  const today = new Date();
  const currentKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const months = new Set(transactions.map(t => {
    const d = t.fecha;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }));
  months.add(currentKey);
  return [...months].sort((a, b) => b.localeCompare(a)); // desc
}

export function calcHealthStatus(ingresos, gastos) {
  const balance = ingresos - gastos;
  const savingsRate = ingresos > 0 ? (balance / ingresos) * 100 : (gastos > 0 ? -100 : 0);

  if (ingresos === 0 && gastos > 0) {
    return { icon: "🚨", text: "Solo gastos", msg: "Solo registraste gastos.", color: "danger", savingsRate };
  } else if (savingsRate >= 20) {
    return { icon: "✅", text: "Excelente", msg: "¡Estás ahorrando bien!", color: "good", savingsRate };
  } else if (savingsRate >= 0) {
    return { icon: "⚠️", text: "Estable", msg: "Considera reducir gastos.", color: "warning", savingsRate };
  } else {
    return { icon: "🚨", text: "Atención requerida", msg: "Tus gastos superan tus ingresos.", color: "danger", savingsRate };
  }
}
