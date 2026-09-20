# 家庭記帳 — 規格 (v1)

狀態：`ready-for-agent`（本 repo 尚未設定 issue tracker，spec 暫存於此）
術語依 [CONTEXT.md](../CONTEXT.md)；架構決策見 [docs/adr](./adr)。

## Problem Statement

我和老婆採 AA 制，把錢放進一個共同錢包，共同開銷從裡面扣。目前沒有一個兩人都能隨時看到「錢包還剩多少、錢花去哪」的地方；市面記帳 app 不是要付費、就是資料公開部署後不安全，或功能太多用不到。

## Solution

一個只有我們兩個人能登入的網頁 app，加到手機主畫面後像原生 app 一樣開啟。記帳頁以月曆為主，一眼看到哪天花了多少、錢包餘額多少，點一天就能補記或修改；分析頁依日 / 月 / 年顯示消費分布（甜甜圈圖 + 分類明細）與趨勢柱狀圖。兩人記的帳即時共享，登入一次後不再重複輸入密碼。

## User Stories

### 登入與隱私

1. As a 成員, I want 用 email + 密碼登入, so that 只有我們兩個人看得到家裡的開支。
2. As a 成員, I want 登入一次後手機記住我, so that 之後每次打開都不用再輸入密碼。
3. As a 成員, I want 陌生人即使拿到網址也無法註冊或看到資料, so that 部署在公開平台也安心。
4. As a 成員, I want 可以登出, so that 換手機或借人用時能切換帳號。
5. As a 成員, I want 系統自動知道是我在記帳而不用每次選人, so that 記帳只需要打金額和選分類。

### 存款

6. As a 成員, I want 輸入一筆存入共同錢包的金額, so that 錢包餘額增加。
7. As a 成員, I want 存款日期預設為日曆上選中的那天（開啟時是今天）, so that 日常存款不用改日期、補記時也順手。
8. As a 成員, I want 修改或刪除過去的存款, so that 記錯時能更正。

### 消費

9. As a 成員, I want 輸入一筆消費的金額與分類, so that 錢包餘額減少並納入統計。
10. As a 成員, I want 消費的內容欄位是選填, so that 買早餐這種小事不用打字。
11. As a 成員, I want 消費日期預設為日曆上選中的那天, so that 補記昨天的帳時不用再改日期。
12. As a 成員, I want 從八個固定分類（食物、交通、居家、帳單、衣物、教育、娛樂、其他）中點一個圖示選擇, so that 分類快速一致。
13. As a 成員, I want 修改或刪除過去的消費, so that 記錯或退款時能直接改原紀錄。
14. As a 成員, I want 表單打開時游標直接在金額欄並跳出數字鍵盤, so that 記一筆消費三步完成。
15. As a 成員, I want 金額只能輸入正整數, so that 不會出現小數或負數的錯帳。

### 餘額與記帳頁

16. As a 成員, I want 記帳頁頂端永遠顯示目前錢包餘額, so that 隨時知道還能花多少。
17. As a 成員, I want 記帳頁是月曆，每格顯示當天消費小計（紅）與存款（綠）, so that 一眼看出哪幾天有花錢、哪天花最多。
18. As a 成員, I want 點某一天後在月曆下方列出那天的所有紀錄, so that 能確認某筆帳有沒有記。
19. As a 成員, I want 左右切換月份, so that 能回顧過去的月份。
20. As a 成員, I want 一個「回到本日」按鈕, so that 翻到很遠的月份後能一鍵回到今天。
21. As a 成員, I want 點清單上的某筆紀錄就打開編輯表單, so that 修改不用另外找入口。
22. As a 成員, I want 刪除紀錄不需二次確認, so that 操作不囉嗦。
23. As a 成員, I want 老婆記的帳在我手機上重新整理後就看得到, so that 我們看到的是同一份帳。

### 分析頁

24. As a 成員, I want 在記帳頁與分析頁之間切換，預設是記帳頁, so that 打開就能記帳，想看統計再切過去。
25. As a 成員, I want 切換統計區間的粒度（日 / 月 / 年）並前後翻頁, so that 看任意一天、一個月或一年的消費。
26. As a 成員, I want 一個甜甜圈圖，中心顯示區間總消費，圓外標各分類百分比與圖示, so that 一眼知道這段期間花了多少、主要花在哪。
27. As a 成員, I want 甜甜圈圖下方有分類明細列表（圖示、名稱、筆數、金額），金額由大到小, so that 小佔比的分類也看得清楚數字。
28. As a 成員, I want 月區間顯示每日消費柱狀圖、年區間顯示每月消費柱狀圖, so that 看出消費趨勢與爆量的日子。
29. As a 成員, I want 日區間不顯示趨勢圖, so that 畫面不出現無意義的單根柱子。
30. As a 成員, I want 區間內沒有消費時顯示明確的空狀態, so that 不會誤以為圖表壞了。

### 裝置與外觀

31. As a 成員, I want 在手機上操作順手（單手、底部按鈕、大點擊區）, so that 隨手就能記。
32. As a 成員, I want 在電腦瀏覽器打開也排版正常, so that 月底在電腦上核對方便。
33. As a 成員, I want 把網頁加到手機主畫面後全螢幕開啟、有自己的 icon, so that 用起來像原生 app。
34. As a 成員, I want 清晰明亮的介面：淺藍頂欄、白色卡片、每個分類有鮮豔的專屬顏色, so that 看起來親切、圖表容易辨識。
35. As a 成員, I want 沒有網路時看到「無法連線」的提示而不是靜默失敗, so that 知道這筆帳沒存進去。

### 維運

36. As a 成員, I want 資料庫不會因為我們幾天沒記帳就被暫停, so that 出國回來打開 app 還能用。
37. As a 成員, I want 推送程式碼後自動部署, so that 不用手動上傳。

## Implementation Decisions

### 架構（見 ADR-0001）

- 前端：Vue 3 + Vite 單頁應用，不用 TypeScript，趨勢柱狀圖用 Chart.js，日期運算用 date-fns。
- 部署：GitHub Pages，repo `tpma1205/family-ledger`，GitHub Actions 在 push 到 `main` 時 build 並發布。Vite `base` 設為 `/family-ledger/`。
- 資料與登入：Supabase 專案 `family-ledger`（ref `serggavvusovsjufdrhb`，區域 ap-northeast-1）。前端直接用 Supabase JS client，不寫後端。
- Keepalive：GitHub Actions 排程每 3 天對 Supabase 執行一次輕量查詢，避免免費專案 7 天無活動被暫停。
- PWA：manifest + icon（512 / 192）+ iOS `apple-touch-icon`，`display: standalone`。不做 service worker 離線快取。
- 環境變數：Supabase URL 與 publishable key 以 `VITE_*` 注入，本機用 `.env.local`（不進 git），CI 用 repository secrets。

### 登入

- Supabase Auth，email + 密碼。兩個成員帳號由建置時手動建立（email 不寫在 repo，repo 是公開的），初始密碼由成員自行保管與更改，不寫入任何檔案。後台建議關閉「Enable Sign Ups」，但真正的存取邊界是 RLS + `members` 表。
- Session 持久化採 Supabase client 預設（localStorage + refresh token 自動更新），達成「記住我」。
- 未登入時整個 app 只顯示登入頁；登入後進入記帳頁。提供登出。
- 記錄者 = `auth.uid()`，由資料庫預設值填入，前端不選、不顯示。

### 資料模型（見 ADR-0002、ADR-0003）

兩張表，欄位語意如下（不含索引與型別細節）：

- **deposits**：id、金額（正整數，資料庫 CHECK > 0）、日期（`date`）、記錄者（預設 `auth.uid()`）、`created_at`。
- **expenses**：id、金額（正整數，CHECK > 0）、日期（`date`）、分類（限定八值的 enum）、內容（可空文字）、記錄者、`created_at`。

- 另有 **members** 表列出兩位成員的 auth id（RLS：成員可讀、不可寫）。存款與消費兩張表皆啟用 RLS：只有 `members` 內的帳號可讀寫全部列（兩人共用一個錢包，不按記錄者隔離）；即使有人註冊成功也看不到資料。匿名不可存取。
- 需明確 `GRANT` 給 `authenticated` 角色（上一個專案曾因 Supabase 預設不自動 expose 新表而 401，此處不重蹈）。
- 餘額不存表，前端以 Σdeposits − Σexpenses 計算。
- 分類的圖示與顏色是前端常數，不存資料庫。

### 領域模組 `ledger`（測試接縫）

純函式，無 Supabase 依賴，輸入為存款陣列與消費陣列（皆為 `{amount, date, ...}`），輸出：

- `balance(deposits, expenses)` → 整數
- `daySummaries(deposits, expenses, yearMonth)` → 該月每天的 `{expenseTotal, depositTotal}`，供日曆格子使用
- `recordsOn(deposits, expenses, date)` → 該日紀錄，依 `created_at` 排序
- `periodStats(expenses, {granularity: 'day'|'month'|'year', anchor})` → `{total, byCategory: [{category, count, amount, ratio}] 降序, trend: [{label, amount}] | null}`；`day` 時 `trend` 為 `null`

統計區間的邊界以 date-fns 的 `startOf* / endOf*` 定義，全部以字串日期比較，不涉時區。

### 資料存取層

- 一個薄薄的 `api` 模組包住 Supabase：`listAll()`（撈全部存款與消費；Supabase 單次上限 1000 列，內部以 range 分頁直到撈完）、`createDeposit / updateDeposit / deleteDeposit`、`createExpense / updateExpense / deleteExpense`。
- 每次寫入成功後重新 `listAll()`，不做樂觀更新或即時訂閱（v1 不需要）。
- 網路或權限錯誤統一轉成使用者可讀的提示（「無法連線，請稍後再試」）。

### UI 結構

- 底部兩個 tab：記帳（預設）、分析。
- **記帳頁**：餘額卡 → 月份列（‹ 2026 年 9 月 › + 回到本日）→ 月曆格（週一起始，格內紅色消費小計、綠色 +存款）→ 選中日紀錄清單 → 右下「+」浮動按鈕。
- **紀錄表單**：底部滑出 sheet。頂部「消費 | 存款」切換；欄位：金額（`inputmode=numeric`，自動 focus）、日期（預設選中日）、分類（八個圖示按鈕 4×2，消費限定）、內容（消費限定、選填）。編輯模式多「刪除」按鈕，刪除直接執行。
- **分析頁**：區間列（日 / 月 / 年切換 + ‹ › 翻頁）→ 甜甜圈圖（自繪 SVG：七片以內用 Chart.js 反而難控制外圈標籤；中心畫總額，外圈標籤為百分比 + 圖示，佔比 < 4% 的片不標、由下方明細列表補足）→ 分類明細列表 → 趨勢柱狀圖（月：31 根以內；年：12 根；日：不渲染）。
- 視覺：淺藍主色（約 `#8EC5E3`）頂欄、白色圓角卡片、消費紅、存款綠、八分類各一固定顏色。手機優先，桌機時內容置中、最大寬度約 480–640px。

## Testing Decisions

- 好的測試只驗證外部可觀察行為：給定存款與消費陣列，斷言餘額、每日小計、區間統計的輸出；不測內部資料結構或呼叫順序。
- **只測 `ledger` 領域模組**，用 Vitest。案例至少涵蓋：空資料；只有存款；只有消費；跨月／跨年邊界（1/31、12/31、閏年 2/29）；同日多筆排序；分類佔比合計為 100%；`day` 粒度 `trend` 為 `null`；年粒度 12 個月缺月補 0。
- Supabase 存取層與 Vue 元件不寫自動化測試，以瀏覽器實際操作驗證（登入、記一筆、改一筆、刪一筆、兩個帳號互看、加到主畫面）。
- 本 repo 為全新專案，無既有測試可參考。

## Out of Scope

- 週統計區間
- AA 對帳（各成員存款累計、差額、誰該補錢）
- 退款作為獨立概念（以修改原消費金額處理）
- 離線記帳與同步
- 即時訂閱（另一人記帳後不重新整理即更新）
- 預算、上期比較、匯出、搜尋、篩選
- 自訂分類、分類圖示可改
- 小數金額、多幣別
- 刪除二次確認、回收桶、復原
- 第三個以上的成員、公開註冊

## Further Notes

- 本機無 `gh` CLI 且 repo 未設定 issue tracker，spec 以本檔案代替 issue；若之後跑 `/setup-matt-pocock-skills`，可將本檔內容搬進 GitHub Issues。
- Supabase publishable key 出現在前端 bundle 是預期行為；安全邊界是 RLS + `members` 表；關閉註冊只是保險。
- 上一個專案（poyang-schedule）的 FullCalendar 版本踩雷與 GRANT 踩雷都記在該專案記憶中；本專案不用 FullCalendar（月曆自己畫，需求只有月格 + 小計），但 GRANT 要記得做。
- 建置後仍需成員手動完成：GitHub repo Settings → Secrets 填入 `VITE_SUPABASE_URL`、`VITE_SUPABASE_PUBLISHABLE_KEY`；Pages source 改為 GitHub Actions；兩支手機各自「加到主畫面」。
