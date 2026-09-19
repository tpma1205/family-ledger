# 家庭記帳

兩人 AA 制共同錢包記帳。前端 Vue 3 + Vite，資料與登入用 Supabase，部署在 GitHub Pages。

- 術語：[CONTEXT.md](CONTEXT.md)
- 決策：[docs/adr](docs/adr)
- 規格：[docs/spec.md](docs/spec.md)

## 本機開發

```bash
cp .env.example .env.local   # 填入 Supabase URL 與 publishable key
npm install
npm run dev
```

測試（只測 `src/lib/ledger.js` 這個純函式模組）：

```bash
npm test
```

## 第一次部署要手動做的事

1. GitHub repo → Settings → Secrets and variables → Actions → 新增
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
2. GitHub repo → Settings → Pages → Source 選 **GitHub Actions**
3. push 到 `main`，等 Actions 跑完，網址是 `https://<帳號>.github.io/family-ledger/`
4. Supabase 後台 → Authentication → Sign In / Providers → 關閉 **Allow new users to sign up**
   （即使不關，RLS 也只允許 `members` 表列出的兩個帳號讀寫；關掉是多一層保險）
5. 兩支手機用瀏覽器開網址 → 分享 → **加到主畫面**

## 資料庫

Schema 在 Supabase 專案 `family-ledger` 的 migration `initial_wallet_schema`：

- `members`：共同錢包的兩位成員（auth user id）
- `deposits`：存款（金額正整數、日期、記錄者）
- `expenses`：消費（金額正整數、日期、分類、內容、記錄者）
- RLS：只有 `members` 內的帳號能讀寫；記錄者由 `auth.uid()` 預設填入

`.github/workflows/keepalive.yml` 每 3 天呼叫一次 `ping()`，避免免費專案被暫停。
