# 02 — 記一筆存款 / 消費並看到餘額

**What to build:** 成員按「+」打開底部表單，切換「消費 | 存款」，輸入金額（自動 focus、數字鍵盤）、選分類圖示（消費）、選填內容，儲存後頂端餘額立刻更新，今天的紀錄出現在清單中；點紀錄可修改或刪除（不二次確認）。另一位成員重新整理後看到同一份帳。

**Blocked by:** 01 — 專案骨架與登入

**Status:** ready-for-agent

- [ ] `deposits`、`expenses` 兩張表，金額 CHECK > 0、日期為 `date`、分類限定七值、記錄者預設 `auth.uid()`
- [ ] RLS：authenticated 可讀寫全部列；anon 不可；已 GRANT 給 authenticated
- [ ] `ledger.balance(deposits, expenses)` 純函式 + Vitest（空、只有存款、只有消費、混合）
- [ ] `api` 模組：listAll、create/update/delete deposit 與 expense；錯誤轉成可讀提示
- [ ] 底部表單：消費/存款切換、金額正整數驗證、日期欄（預設今天）、七分類圖示按鈕、內容選填
- [ ] 餘額卡顯示 Σ存款 − Σ消費
- [ ] 今日紀錄清單（含分類圖示與顏色、存款綠色 +），點擊進編輯，編輯模式有刪除
- [ ] 記錄者由登入身分自動填入，UI 不顯示
- [ ] 無網路 / 失敗時顯示「無法連線，請稍後再試」
