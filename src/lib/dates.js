import { format } from 'date-fns'

export const todayStr = () => format(new Date(), 'yyyy-MM-dd')
export const toYearMonth = (dateStr) => dateStr.slice(0, 7)

// 'YYYY-MM' → 該月月曆格子（週一起始），前後補空格
export function calendarCells(yearMonth) {
  const [y, m] = yearMonth.split('-').map(Number)
  const first = new Date(y, m - 1, 1)
  const days = new Date(y, m, 0).getDate()
  const lead = (first.getDay() + 6) % 7 // 週一 = 0
  const cells = Array.from({ length: lead }, () => null)
  for (let d = 1; d <= days; d++) {
    cells.push(`${yearMonth}-${String(d).padStart(2, '0')}`)
  }
  while (cells.length % 7) cells.push(null)
  return cells
}

export function shiftMonth(yearMonth, delta) {
  const [y, m] = yearMonth.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return format(d, 'yyyy-MM')
}

export function shiftDay(dateStr, delta) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return format(new Date(y, m - 1, d + delta), 'yyyy-MM-dd')
}

export function shiftYear(dateStr, delta) {
  const [y] = dateStr.split('-').map(Number)
  return `${y + delta}${dateStr.slice(4)}`
}

export const fmtMoney = (n) => n.toLocaleString('zh-TW')
