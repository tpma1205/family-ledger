// 純函式領域模組：輸入存款與消費陣列，輸出餘額與各種彙總。
// 紀錄的 date 一律是 'YYYY-MM-DD' 字串，不涉時區。

const sum = (records) => records.reduce((total, r) => total + r.amount, 0)

// 餘額 = Σ存款 − Σ消費
export function balance(deposits, expenses) {
  return sum(deposits) - sum(expenses)
}

// 某月（'YYYY-MM'）每天的消費小計與存款小計，只包含有紀錄的日期
export function daySummaries(deposits, expenses, yearMonth) {
  const inMonth = (r) => r.date.startsWith(yearMonth + '-')
  const summaries = {}
  const entry = (date) => (summaries[date] ??= { expenseTotal: 0, depositTotal: 0 })
  for (const r of expenses.filter(inMonth)) entry(r.date).expenseTotal += r.amount
  for (const r of deposits.filter(inMonth)) entry(r.date).depositTotal += r.amount
  return summaries
}

// 某一天的所有紀錄，存款與消費混排，依建立時間由早到晚
export function recordsOn(deposits, expenses, date) {
  const tag = (kind) => (r) => ({ ...r, kind })
  return [
    ...deposits.filter((r) => r.date === date).map(tag('deposit')),
    ...expenses.filter((r) => r.date === date).map(tag('expense')),
  ].sort((a, b) => a.created_at.localeCompare(b.created_at))
}

const daysInMonth = (year, month) => new Date(year, month, 0).getDate() // month 1-12

// 統計區間：以 anchor（'YYYY-MM-DD'）為錨點，粒度為 day / month / year
export function periodStats(expenses, { granularity, anchor }) {
  const prefix = { day: anchor, month: anchor.slice(0, 7), year: anchor.slice(0, 4) }[granularity]
  const inPeriod = expenses.filter((r) => r.date.startsWith(prefix))
  const total = sum(inPeriod)

  const byCategoryMap = {}
  for (const r of inPeriod) {
    const c = (byCategoryMap[r.category] ??= { category: r.category, count: 0, amount: 0 })
    c.count += 1
    c.amount += r.amount
  }
  const byCategory = Object.values(byCategoryMap)
    .sort((a, b) => b.amount - a.amount)
    .map((c) => ({ ...c, ratio: c.amount / total }))

  return { total, byCategory, trend: trendFor(inPeriod, granularity, anchor) }
}

// 月 → 每天一根；年 → 每月一根；日 → 無趨勢
function trendFor(records, granularity, anchor) {
  if (granularity === 'day') return null
  const year = Number(anchor.slice(0, 4))
  if (granularity === 'month') {
    const month = Number(anchor.slice(5, 7))
    const buckets = Array.from({ length: daysInMonth(year, month) }, (_, i) => ({ label: String(i + 1), amount: 0 }))
    for (const r of records) buckets[Number(r.date.slice(8, 10)) - 1].amount += r.amount
    return buckets
  }
  const buckets = Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}月`, amount: 0 }))
  for (const r of records) buckets[Number(r.date.slice(5, 7)) - 1].amount += r.amount
  return buckets
}
