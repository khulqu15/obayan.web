// composables/data/useFinance.ts
import { ref } from 'vue'
import { useState } from '#imports'

export type FinanceSummary = {
  incomeMonth: number
  incomePrevMonth: number
  incomeYear: number
  incomePrevYear: number
  expenseMonth: number
  expensePrevMonth: number
  balance: number
}

export type FinanceTransaction = {
  id: string
  date: number // timestamp
  type: 'income' | 'expense'
  amount: number
  category?: string
  note?: string
}

export type ReceiptsHistoryItem = {
  date: number // timestamp (00:00)
  total: number
}

const CATEGORIES_IN = ['SPP', 'Donasi', 'Registrasi', 'Kegiatan', 'Lainnya']
const CATEGORIES_OUT = ['Operasional', 'ATK', 'Makan', 'Perawatan', 'Lainnya']

function atStartOfDay(d: Date) {
  const nd = new Date(d)
  nd.setHours(0, 0, 0, 0)
  return nd
}
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function genDummyTransactions(days = 60): FinanceTransaction[] {
  const out: FinanceTransaction[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000)
    const base = atStartOfDay(d).getTime()

    // Income: 1–3 entries per day
    const incomeCount = randInt(1, 3)
    for (let k = 0; k < incomeCount; k++) {
      out.push({
        id: `in-${base}-${k}`,
        date: base + randInt(0, 20_000_000),
        type: 'income',
        amount: randInt(50_000, 1_000_000),
        category: pick(CATEGORIES_IN),
        note: 'Dummy penerimaan',
      })
    }

    // Expense: 0–2 entries per day
    const expenseCount = randInt(0, 2)
    for (let k = 0; k < expenseCount; k++) {
      out.push({
        id: `ex-${base}-${k}`,
        date: base + randInt(0, 20_000_000),
        type: 'expense',
        amount: randInt(25_000, 750_000),
        category: pick(CATEGORIES_OUT),
        note: 'Dummy pengeluaran',
      })
    }
  }
  return out
}

function sumBy(arr: FinanceTransaction[], pred: (t: FinanceTransaction) => boolean) {
  return arr.filter(pred).reduce((a, t) => a + (Number(t.amount) || 0), 0)
}

function buildSummary(tx: FinanceTransaction[]): FinanceSummary {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()

  const prevMonthDate = new Date(y, m - 1, 1)
  const prevYearDate = new Date(y - 1, 0, 1)

  const sameMonth = (t: FinanceTransaction) => {
    const d = new Date(t.date)
    return d.getFullYear() === y && d.getMonth() === m
  }
  const prevMonth = (t: FinanceTransaction) => {
    const d = new Date(t.date)
    return d.getFullYear() === prevMonthDate.getFullYear() && d.getMonth() === prevMonthDate.getMonth()
  }
  const sameYear = (t: FinanceTransaction) => new Date(t.date).getFullYear() === y
  const prevYear = (t: FinanceTransaction) => new Date(t.date).getFullYear() === prevYearDate.getFullYear()

  const incomeMonth = sumBy(tx, t => t.type === 'income' && sameMonth(t))
  const incomePrevMonth = sumBy(tx, t => t.type === 'income' && prevMonth(t))
  const incomeYear = sumBy(tx, t => t.type === 'income' && sameYear(t))
  const incomePrevYear = sumBy(tx, t => t.type === 'income' && prevYear(t))
  const expenseMonth = sumBy(tx, t => t.type === 'expense' && sameMonth(t))
  const expensePrevMonth = sumBy(tx, t => t.type === 'expense' && prevMonth(t))
  const balance = sumBy(tx, t => t.type === 'income') - sumBy(tx, t => t.type === 'expense')

  return { incomeMonth, incomePrevMonth, incomeYear, incomePrevYear, expenseMonth, expensePrevMonth, balance }
}

function buildReceiptsHistory(tx: FinanceTransaction[], days = 30): ReceiptsHistoryItem[] {
  const since = Date.now() - days * 86400000
  const map = new Map<number, number>()
  for (const t of tx) {
    if (t.type !== 'income') continue
    if (t.date < since) continue
    const day = atStartOfDay(new Date(t.date)).getTime()
    map.set(day, (map.get(day) || 0) + t.amount)
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([date, total]) => ({ date, total }))
}

export const useFinance = () => {
  const summary = useState<FinanceSummary | null>('finance:summary', () => null)
  const transactions = useState<FinanceTransaction[]>('finance:tx', () => [])
  const receiptsHistory = useState<ReceiptsHistoryItem[]>('finance:receipts', () => [])
  const _subId = useState<number | null>('finance:subId', () => null)

  async function fetchTransactions() {
    if (transactions.value.length === 0) {
      // generate once
      transactions.value = genDummyTransactions(90)
    }
    return transactions.value
  }

  async function fetchSummary() {
    if (transactions.value.length === 0) await fetchTransactions()
    summary.value = buildSummary(transactions.value)
    return summary.value
  }

  async function fetchReceiptsHistory(opts?: { days?: number }) {
    if (transactions.value.length === 0) await fetchTransactions()
    receiptsHistory.value = buildReceiptsHistory(transactions.value, opts?.days ?? 30)
    return receiptsHistory.value
  }

  function subscribeFinance(intervalMs = 12_000) {
    if (!process.client) return () => {}
    if (_subId.value) return () => unsubscribeFinance()

    const id = window.setInterval(() => {
      // simulasi transaksi baru
      const now = Date.now()
      const isIncome = Math.random() > 0.4
      const t: FinanceTransaction = {
        id: `${isIncome ? 'in' : 'ex'}-${now}`,
        date: now,
        type: isIncome ? 'income' as const : 'expense' as const,
        amount: isIncome ? randInt(50_000, 600_000) : randInt(25_000, 400_000),
        category: isIncome ? pick(CATEGORIES_IN) : pick(CATEGORIES_OUT),
        note: 'Live update (dummy)',
      }
      transactions.value = [t, ...transactions.value].slice(0, 500) // batasi panjang
      summary.value = buildSummary(transactions.value)
      receiptsHistory.value = buildReceiptsHistory(transactions.value, 30)
    }, intervalMs)

    _subId.value = id
    return () => unsubscribeFinance()
  }

  function unsubscribeFinance() {
    if (!process.client) return
    if (_subId.value) {
      clearInterval(_subId.value)
      _subId.value = null
    }
  }

  return {
    summary,
    transactions,
    receiptsHistory,
    fetchSummary,
    fetchTransactions,
    fetchReceiptsHistory,
    subscribeFinance,
    unsubscribeFinance,
  }
}
