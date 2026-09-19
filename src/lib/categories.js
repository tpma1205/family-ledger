// 七個固定分類：圖示與顏色寫死在前端，不存資料庫
export const CATEGORIES = [
  { key: 'food', label: '食物', color: '#f0655c',
    path: 'M7 3v7a2.5 2.5 0 0 0 5 0V3M9.5 3v18M17 3c-1.5 1.5-2.5 4.5-2.5 8 0 1.5.5 2.5 1.5 3V21M17 3v11' },
  { key: 'clothing', label: '衣物', color: '#e27db0',
    path: 'M9 4a3 3 0 0 0 6 0l5 3-2 4-2-1v10H8V10l-2 1-2-4z' },
  { key: 'home', label: '居家', color: '#8dbf3c',
    path: 'M3 11.5 12 4l9 7.5M5.5 10v10h13V10M10 20v-6h4v6' },
  { key: 'transport', label: '交通', color: '#4c8fe8',
    path: 'M5 17H3v-5l2-5h14l2 5v5h-2M3 12h18M6 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0M14 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0' },
  { key: 'education', label: '教育', color: '#8b7bdf',
    path: 'M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3zM21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z' },
  { key: 'entertainment', label: '娛樂', color: '#f4a32c',
    path: 'M3 8h18v3a2 2 0 0 0 0 2v3H3v-3a2 2 0 0 0 0-2zM10 8v8M14 8v8' },
  { key: 'other', label: '其他', color: '#98a4b0',
    path: 'M4 4h7l9 9-7 7-9-9zM8.5 8.5h.01' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]))

export const DEPOSIT_STYLE = { label: '存款', color: '#1f9d6f', path: 'M12 5v14M5 12h14' }
