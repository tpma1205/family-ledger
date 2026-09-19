import { describe, it, expect } from 'vitest'
import { balance, daySummaries, recordsOn, periodStats } from './ledger.js'

const d = (amount, date) => ({ amount, date })
const e = (amount, date, category = 'food') => ({ amount, date, category })

describe('餘額', () => {
  it('沒有任何紀錄時為 0', () => {
    expect(balance([], [])).toBe(0)
  })

  it('只有存款時等於存款總和', () => {
    expect(balance([d(5000, '2026-09-01'), d(3000, '2026-09-10')], [])).toBe(8000)
  })

  it('只有消費時為負數', () => {
    expect(balance([], [e(120, '2026-09-19')])).toBe(-120)
  })

  it('存款減消費', () => {
    expect(balance([d(5000, '2026-09-01')], [e(120, '2026-09-19'), e(420, '2026-09-19')])).toBe(4460)
  })
})

describe('月曆每日小計', () => {
  const deposits = [d(5000, '2026-09-15'), d(1000, '2026-10-01')]
  const expenses = [
    e(120, '2026-09-19'), e(420, '2026-09-19', 'transport'),
    e(1860, '2026-09-18', 'home'), e(99, '2026-08-31'),
  ]

  it('只回傳該月有紀錄的日期', () => {
    const s = daySummaries(deposits, expenses, '2026-09')
    expect(Object.keys(s).sort()).toEqual(['2026-09-15', '2026-09-18', '2026-09-19'])
  })

  it('同一天多筆消費加總，存款另計', () => {
    const s = daySummaries(deposits, expenses, '2026-09')
    expect(s['2026-09-19']).toEqual({ expenseTotal: 540, depositTotal: 0 })
    expect(s['2026-09-15']).toEqual({ expenseTotal: 0, depositTotal: 5000 })
  })

  it('不會把 8/31 或 10/1 算進 9 月', () => {
    const s = daySummaries(deposits, expenses, '2026-09')
    expect(s['2026-08-31']).toBeUndefined()
    expect(s['2026-10-01']).toBeUndefined()
  })

  it('閏年 2/29 可以有紀錄', () => {
    const s = daySummaries([], [e(50, '2028-02-29')], '2028-02')
    expect(s['2028-02-29']).toEqual({ expenseTotal: 50, depositTotal: 0 })
  })
})

describe('某日紀錄', () => {
  const deposits = [{ id: 'd1', amount: 5000, date: '2026-09-19', created_at: '2026-09-19T01:00:00Z' }]
  const expenses = [
    { id: 'e1', amount: 120, date: '2026-09-19', category: 'food', created_at: '2026-09-19T00:30:00Z' },
    { id: 'e2', amount: 420, date: '2026-09-19', category: 'transport', created_at: '2026-09-19T03:00:00Z' },
    { id: 'e3', amount: 99, date: '2026-09-18', category: 'food', created_at: '2026-09-18T03:00:00Z' },
  ]

  it('混合存款與消費，依 created_at 由早到晚，並標記 kind', () => {
    const rows = recordsOn(deposits, expenses, '2026-09-19')
    expect(rows.map((r) => [r.kind, r.id])).toEqual([
      ['expense', 'e1'], ['deposit', 'd1'], ['expense', 'e2'],
    ])
  })

  it('沒有紀錄的日子回傳空陣列', () => {
    expect(recordsOn(deposits, expenses, '2026-09-01')).toEqual([])
  })
})

describe('統計區間', () => {
  const expenses = [
    e(120, '2026-09-19', 'food'), e(80, '2026-09-19', 'food'),
    e(420, '2026-09-19', 'transport'), e(1860, '2026-09-18', 'home'),
    e(99, '2026-08-31', 'food'), e(500, '2026-01-05', 'entertainment'),
    e(10, '2025-12-31', 'other'),
  ]

  it('日區間：只算那一天，trend 為 null', () => {
    const s = periodStats(expenses, { granularity: 'day', anchor: '2026-09-19' })
    expect(s.total).toBe(620)
    expect(s.trend).toBeNull()
  })

  it('分類彙總依金額降序，含筆數與佔比', () => {
    const s = periodStats(expenses, { granularity: 'day', anchor: '2026-09-19' })
    expect(s.byCategory).toEqual([
      { category: 'transport', count: 1, amount: 420, ratio: 420 / 620 },
      { category: 'food', count: 2, amount: 200, ratio: 200 / 620 },
    ])
  })

  it('月區間：trend 為該月每天，缺日補 0', () => {
    const s = periodStats(expenses, { granularity: 'month', anchor: '2026-09-19' })
    expect(s.total).toBe(2480)
    expect(s.trend).toHaveLength(30)
    expect(s.trend[17]).toEqual({ label: '18', amount: 1860 })
    expect(s.trend[18]).toEqual({ label: '19', amount: 620 })
    expect(s.trend[0]).toEqual({ label: '1', amount: 0 })
  })

  it('月區間：2 月閏年有 29 天', () => {
    const s = periodStats([], { granularity: 'month', anchor: '2028-02-10' })
    expect(s.trend).toHaveLength(29)
  })

  it('年區間：trend 為 12 個月，缺月補 0，不含去年 12/31', () => {
    const s = periodStats(expenses, { granularity: 'year', anchor: '2026-06-01' })
    expect(s.total).toBe(3079)
    expect(s.trend).toHaveLength(12)
    expect(s.trend[0]).toEqual({ label: '1月', amount: 500 })
    expect(s.trend[7]).toEqual({ label: '8月', amount: 99 })
    expect(s.trend[8]).toEqual({ label: '9月', amount: 2480 })
    expect(s.trend[11]).toEqual({ label: '12月', amount: 0 })
  })

  it('空區間：total 0、byCategory 空、trend 全 0', () => {
    const s = periodStats(expenses, { granularity: 'month', anchor: '2024-03-01' })
    expect(s.total).toBe(0)
    expect(s.byCategory).toEqual([])
    expect(s.trend.every((t) => t.amount === 0)).toBe(true)
  })

  it('佔比合計為 1', () => {
    const s = periodStats(expenses, { granularity: 'year', anchor: '2026-06-01' })
    const total = s.byCategory.reduce((acc, c) => acc + c.ratio, 0)
    expect(total).toBeCloseTo(1, 10)
  })
})
