export const fmtMoney = (n) => n.toLocaleString('zh-TW')

// 月曆格子太小，金額縮寫：1.2k、1.5萬
export function shortMoney(n) {
  if (n >= 10000) return (n / 10000).toFixed(n % 10000 === 0 ? 0 : 1) + '萬'
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k'
  return String(n)
}
