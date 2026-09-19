# 前端靜態部署於 GitHub Pages，資料與登入交給 Supabase，不自架後端

兩人家庭記帳需要兩位成員即時看到同一份帳與餘額，且平台必須免費。決定前端以 Vue 3 + Vite 建成靜態網站部署到 GitHub Pages，資料、登入與存取控制全部交給 Supabase（Postgres + Auth + Row Level Security），不寫任何自己的伺服器程式。

## Considered Options

- **純前端 + 本機儲存**：最簡單，但兩人資料不同步，違背「共同錢包」本質。
- **自架後端（Render / Fly.io / Zeabur）**：免費方案會休眠、冷啟動慢，且要自己處理備份、Auth、連線池；本專案沒有任何需要後端邏輯的需求。
- **Supabase（採用）**：兩人用量遠低於免費額度；Auth 的「記住我」與 RLS 直接解決隱私需求。

## Consequences

- Supabase 免費專案 7 天無資料庫活動會被暫停，需手動 restore。以 GitHub Actions 排程每 3 天 ping 一次資料庫來避免。
- Supabase anon key 會出現在前端程式碼中，這是設計上允許的；安全邊界靠 RLS 與關閉公開註冊，不靠隱藏 key。
- 隱私靠「Supabase 後台關閉 Sign Ups、只手動建立兩個帳號」達成，而非網頁自訂密碼。
- Supabase 專案：`family-ledger`（ref `serggavvusovsjufdrhb`，區域 ap-northeast-1 Tokyo），與另一個專案 `poyang-schedule` 完全獨立。
