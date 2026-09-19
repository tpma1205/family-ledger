# 05 — PWA、自動部署、keepalive

**What to build:** push 到 `main` 後網站自動出現在 GitHub Pages；手機可「加到主畫面」並全螢幕開啟、有自己的 icon；Supabase 不會因幾天沒用而被暫停。

**Blocked by:** 01 — 專案骨架與登入

**Status:** ready-for-agent

- [ ] `manifest.webmanifest`（名稱、icon 512/192、主題色、standalone）+ iOS `apple-touch-icon` meta
- [ ] GitHub Actions：push main → build → 部署 Pages，secrets 注入 `VITE_SUPABASE_URL`、`VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] GitHub Actions：每 3 天排程對 Supabase 執行一次輕量查詢
- [ ] README：列出成員要手動完成的步驟（填 secrets、Pages source 改 GitHub Actions、加到主畫面）
- [ ] repo 已推到 `git@github.com:tpma1205/family-ledger.git`
