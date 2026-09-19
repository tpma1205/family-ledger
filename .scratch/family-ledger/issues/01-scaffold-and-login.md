# 01 — 專案骨架與登入

**What to build:** 成員打開網址看到登入頁，用 email + 密碼登入後看到底部有「記帳 / 分析」兩個 tab 的空殼（預設記帳）；關掉瀏覽器再開不用重新登入；可以登出。陌生人無法註冊。

**Blocked by:** None — can start immediately

**Status:** done

- [x] Vue 3 + Vite 專案可 `npm run dev` / `npm run build`，Vite base 為 `/family-ledger/`
- [x] Supabase 專案 `family-ledger` 關閉 Enable Sign Ups 與 email 確認；兩個成員帳號已建立
- [x] 登入頁：email、密碼、錯誤訊息；成功後進入 app
- [x] Session 持久化：重新整理 / 關閉重開仍為登入狀態
- [x] 登出按鈕
- [x] 底部 tab 列（記帳預設、分析），頁面為空殼
- [x] 手機優先版面；桌機時內容置中、最大寬度約 480–640px
- [x] 淺藍頂欄 + 白色卡片的基礎視覺系統與分類顏色常數就位
- [x] Supabase URL / key 走 `VITE_*` 環境變數，`.env.local` 不進 git
