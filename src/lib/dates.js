import { format, addMonths, addYears, addDays } from 'date-fns'

export const todayStr = () => format(new Date(), 'yyyy-MM-dd')
export const toYearMonth = (dateStr) => dateStr.slice(0, 7)

const parse = (dateStr) => {
  const [y, m, d = 1] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

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

export const shiftMonth = (yearMonth, delta) => format(addMonths(parse(yearMonth), delta), 'yyyy-MM')
// 以下三個保留完整日期；月底會自動夾到目標月的最後一天（1/31 → 2/28）
export const shiftDay = (dateStr, delta) => format(addDays(parse(dateStr), delta), 'yyyy-MM-dd')
export const shiftMonthKeepDay = (dateStr, delta) => format(addMonths(parse(dateStr), delta), 'yyyy-MM-dd')
export const shiftYearKeepDay = (dateStr, delta) => format(addYears(parse(dateStr), delta), 'yyyy-MM-dd')

// 中文顯示
export const formatYearMonth = (yearMonth) => {
  const [y, m] = yearMonth.split('-')
  return `${y} 年 ${Number(m)} 月`
}
export const formatDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-')
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`
}
export const formatMonthDay = (dateStr) => {
  const [, m, d] = dateStr.split('-')
  return `${Number(m)} 月 ${Number(d)} 日`
}
