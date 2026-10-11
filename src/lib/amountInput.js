// 紀錄表單自製數字鍵盤的輸入規則。金額以數字字串表示，'' 代表尚未輸入。

// 9,999,999 元：家用單筆遠低於此，大字金額在窄螢幕也不會溢出
export const MAX_DIGITS = 7

// key：'0'–'9' 或 'back'；其他鍵忽略
export function pressKey(current, key) {
  if (key === 'back') return current.slice(0, -1)
  if (!/^\d$/.test(key)) return current
  if (current === '' && key === '0') return current
  if (current.length >= MAX_DIGITS) return current
  return current + key
}

export const isValidAmount = (amount) => /^\d+$/.test(amount) && Number(amount) > 0
