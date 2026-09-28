# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 指令

```bash
npm run dev            # 開發伺服器（.claude/launch.json 已設定，可用 preview_start 啟動）
npm run build          # 產生 dist/
npm test               # 全部測試
npx vitest run -t "餘額"   # 只跑符合名稱的測試
```

測試只有一個檔案：`src/lib/ledger.test.js`。

## 架構

三層，界線刻意保持清楚：

1. **`src/lib/ledger.js`** — 純函式領域模組，輸入存款與消費陣列，輸出餘額、月曆每日小計、某日紀錄、區間統計。**沒有任何 Supabase 或 Vue 依賴，是唯一寫測試的地方**（約定的測試接縫，見 `docs/spec.md` 的 Testing Decisions）。算錢的邏輯一律放這裡。
2. **`src/lib/api.js`** — Supabase CRUD 薄層。`listAll()` 一次撈全部（內部 range 分頁，Supabase 單次上限 1000 列）；所有錯誤轉成同一句使用者可讀訊息。
3. **`src/composables/` 與 `src/components/`** — Vue 狀態與畫面。`useLedger` 持有全域紀錄陣列，**寫入成功後一律重新 `listAll()`**，不做樂觀更新，也沒有即時訂閱。

日期一律是 `'YYYY-MM-DD'` 字串，比較與分組都用字串前綴，不轉 Date、不涉時區（ADR-0003）。日期運算集中在 `src/lib/dates.js`，金額格式在 `src/lib/money.js`。

## 資料與權限

- 兩張紀錄表 `deposits` / `expenses`，外加 `members` 表列出兩位成員的 auth id。
- RLS policy 全部透過 `is_member()` 判斷；**存取邊界是 `members` 表，不是「有沒有登入」**。新增紀錄時 `recorded_by` 必須等於 `auth.uid()`，且有 trigger 擋住事後修改。
- 前端的 Supabase publishable key 公開是預期的；安全靠 RLS。
- Schema 變更透過 Supabase MCP 的 `apply_migration`，repo 裡沒有 migration 檔。

### 兩個容易漏的步驟

- **新增消費分類**：要（a）跑 migration `alter type public.expense_category add value '<key>'`，（b）在 `src/lib/categories.js` 加圖示與顏色，（c）更新 `CONTEXT.md` 與 `docs/spec.md` 的分類清單。表單是 4 欄排列，分類數量最好維持 4 的倍數。
- **新增資料表**：migration 裡必須同時寫 `grant ... to authenticated`（本專案不給 `anon` 任何權限）。Supabase 自 2026-10-30 起不再自動授權新表，漏了會 403。

## 部署

push 到 `main` → GitHub Actions 跑測試、build、部署到 GitHub Pages（`https://tpma1205.github.io/family-ledger/`）。Vite `base` 是 `/family-ledger/`，改 repo 名要一起改。另一個排程 workflow 每 3 天呼叫 `ping()` 避免免費專案被暫停。

## 文件

- `CONTEXT.md` — 術語表。寫程式與 UI 文案都用這裡的詞（例如用「消費」不用「支出」）。
- `docs/spec.md` — 完整規格與範圍外清單。
- `docs/adr/` — 三個架構決策：為何不自架後端、為何存款與消費分表、為何日期只到日。
- `.scratch/family-ledger/issues/` — 開發用的票，01–05 已完成。
