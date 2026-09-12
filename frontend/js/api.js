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
function getToken() {
  return localStorage.getItem('finanzas_jwt');
}

async function fetchAPI(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Token expirado o inválido
      localStorage.removeItem('finanzas_jwt');
      localStorage.removeItem('finanzas_user');
      window.location.hash = '#auth'; // Forzar login
    }
    throw new Error(data.error || 'Error en la petición');
  }

  return data;
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export const auth = {
  async login(email, password) {
    const data = await fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('finanzas_jwt', data.token);
    localStorage.setItem('finanzas_user', JSON.stringify(data.user));
    return data.user;
  },

  async register(email, password, username) {
    const data = await fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username })
    });
    // Autologin después de registro exitoso
    return this.login(email, password);
  },

  logout() {
    localStorage.removeItem('finanzas_jwt');
    localStorage.removeItem('finanzas_user');
  },

  getCurrentUser() {
    const token = getToken();
    const userStr = localStorage.getItem('finanzas_user');
    if (!token || !userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
};

// ─── Transacciones ──────────────────────────────────────────────────────────
export const db = {
  async getTransactions() {
    const data = await fetchAPI('/api/transactions');
    // Mapear al formato que espera el frontend (convertir fechas y strings a números)
    return data.map(t => ({
      ...t,
      fecha: new Date(t.fecha),
      monto: Number(t.monto)
    }));
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
