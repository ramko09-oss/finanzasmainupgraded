// ============================================================
// db.js — Módulo de Firestore: CRUD de transacciones
// ============================================================

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";

// ─── Configuración de Monedas ──────────────────────────────────────────────────
// Los montos se guardan en USD en Firestore (igual que en el original Python)
export const CURRENCIES = {
  USD: { symbol: "$",  name: "Dólar (USD)",         rate: 1.0   },
  EUR: { symbol: "€",  name: "Euro (EUR)",            rate: 0.92  },
  PEN: { symbol: "S/", name: "Sol (PEN)",             rate: 3.72  },
  MXN: { symbol: "$",  name: "Peso Mexicano (MXN)",   rate: 17.15 },
};

// ─── Formatear monto en la moneda local ─────────────────────────────────────
export function formatCurrency(amountUsd, currencyCode) {
  const currency = CURRENCIES[currencyCode] ?? CURRENCIES["USD"];
  const converted = amountUsd * currency.rate;
  return `${currency.symbol}${converted.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ─── Obtener todas las transacciones de un usuario ─────────────────────────────
export async function getTransactions(uid) {
  const q = query(
    collection(db, "usuarios", uid, "transacciones"),
    orderBy("fecha", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id:          docSnap.id,
      fecha:       data.fecha?.toDate?.() ?? new Date(data.fecha),
      descripcion: data.descripcion,
      tipo:        data.tipo,         // "Ingreso" | "Gasto"
      monto:       Number(data.monto), // siempre en USD
    };
  });
}

// ─── Agregar una transacción ──────────────────────────────────────────────────
// `montoLocal` es en la moneda del usuario → se convierte a USD antes de guardar
export async function addTransaction(uid, { tipo, montoLocal, descripcion, fecha, currencyCode }) {
  const currency = CURRENCIES[currencyCode] ?? CURRENCIES["USD"];
  const montoUsd = montoLocal / currency.rate;

  await addDoc(collection(db, "usuarios", uid, "transacciones"), {
    tipo,
    monto:       montoUsd,
    descripcion,
    fecha:       Timestamp.fromDate(new Date(fecha)),
  });
}

// ─── Eliminar una transacción ─────────────────────────────────────────────────
export async function deleteTransaction(uid, docId) {
  await deleteDoc(doc(db, "usuarios", uid, "transacciones", docId));
}

// ─── Calcular métricas agregadas ──────────────────────────────────────────────
export function calcMetrics(transactions) {
  const totalIngresos = transactions
    .filter(t => t.tipo === "Ingreso")
    .reduce((s, t) => s + t.monto, 0);

  const totalGastos = transactions
    .filter(t => t.tipo === "Gasto")
    .reduce((s, t) => s + t.monto, 0);

  return {
    totalIngresos,
    totalGastos,
    saldoTotal: totalIngresos - totalGastos,
    totalTransacciones: transactions.length,
  };
}

// ─── Filtrar transacciones por mes ─────────────────────────────────────────────
export function filterByMonth(transactions, year, month) {
  return transactions.filter(t => {
    const d = t.fecha;
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

// ─── Agrupar por mes (para gráficos de evolución) ────────────────────────────
export function groupByMonth(transactions) {
  const map = {};

  transactions.forEach(t => {
    const d = t.fecha;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!map[key]) map[key] = { mes: key, Ingreso: 0, Gasto: 0 };
    map[key][t.tipo] += t.monto;
  });

  // Ordenar cronológicamente
  return Object.values(map).sort((a, b) => a.mes.localeCompare(b.mes));
}

// ─── Lista de meses disponibles (más el mes actual) ───────────────────────────
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

// ─── Calcular salud financiera ────────────────────────────────────────────────
export function calcHealthStatus(ingresos, gastos) {
  const balance = ingresos - gastos;
  const savingsRate = ingresos > 0 ? (balance / ingresos) * 100 : (gastos > 0 ? -100 : 0);

  if (ingresos === 0 && gastos > 0) {
    return { icon: "🚨", text: "Solo gastos",          msg: "Solo registraste gastos. Agrega tus ingresos para un análisis completo.", color: "danger", savingsRate };
  } else if (savingsRate >= 20) {
    return { icon: "✅", text: "Excelente",             msg: "¡Sigue así, estás ahorrando bien!",                                      color: "good",    savingsRate };
  } else if (savingsRate >= 0) {
    return { icon: "⚠️", text: "Estable",               msg: "Considera reducir gastos para ahorrar más.",                              color: "warning", savingsRate };
  } else {
    return { icon: "🚨", text: "Atención requerida",   msg: "Tus gastos superan tus ingresos.",                                        color: "danger",  savingsRate };
  }
}
