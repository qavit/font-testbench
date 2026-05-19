# Font Testbench

一個用來比較 CJK 地區字形差異、台語/客語用字、白話字/台羅、方音符號與 IPA 支援度的小工具。

## 快速使用

1. 把要測的字型檔放進 `fonts/`。

   支援常見 OpenType/TrueType 檔案：`.otf`, `.ttf`, `.ttc`, `.otc`, `.woff`, `.woff2`。

2. 啟動本機版做視覺比較。

   ```bash
   python3 scripts/serve.py
   ```

   然後打開：

   ```text
   http://127.0.0.1:8765
   ```

   本機版會預設掃描三個字型庫來源：

   - `/System/Library/Fonts`
   - `/System/Library/Fonts/Supplemental`
   - `/Users/jacques/Library/Fonts`

   可從左側字型庫清單勾選字型家族或單一 face，再按「加入勾選」批次加入；滑過字型家族或 face 時也會出現 `+`，可直接加入。`恢復預設` 會把比較列重設為 `PingFang TC` 和 `Noto Sans TC`。

   若你直接打開 `index.html`，只要 `scripts/serve.py` 同時開著，頁面也會連到 `http://127.0.0.1:8765` 掃描字型資料夾；若 server 沒開，仍可用「加入字型檔」「加入資料夾」或 Finder 拖放。

   字體卡片是等高橫向長條列，文字區可以水平捲動；可以拖 `↕` 排序，也可以逐一移除；左側設定表單可收合。

3. 跑 coverage 檢查。

   ```bash
   python3 -m pip install -r requirements.txt
   python3 scripts/coverage.py
   ```

   若你是用 Homebrew 安裝系統級 `fonttools`，只要 `ttx` 或 `fonttools` 在 `PATH` 裡，腳本會自動改用那個 Python 環境執行。

   如果字型都在 macOS 使用者字型資料夾：

   ```bash
   python3 scripts/coverage.py --user-fonts
   ```

   也可以同時掃多個來源：

   ```bash
   python3 scripts/coverage.py --fonts-dir fonts --fonts-dir ~/Library/Fonts
   ```

   輸出會放在：

   - `reports/coverage.csv`
   - `reports/coverage.html`

## 目錄

```text
font-testbench/
  fonts/                  # 放待測字型，git 只保留 .gitkeep
  samples/                # 測試字串
  scripts/
    coverage.py           # cmap coverage 檢查
    serve.py              # 本機字型資料夾 API 與靜態 server
  reports/                # 產出的報告，git 只保留 .gitkeep
  index.html              # 互動視覺預覽
  styles.css              # UI 樣式
  app.js                  # 前端互動邏輯
```

## 判讀方式

`coverage.py` 檢查的是字型 cmap 是否有對應 Unicode code point。它很適合判斷「字元是否支援」，例如 CJK Extension、方音符號、IPA、combining marks。

台羅、白話字、客語白話字仍需要搭配 `index.html` 人工看 shaping 品質，因為 `o͘`, `a̍`, `ⁿ` 這類文字即使 code point 都存在，也可能有組合符號定位不佳、fallback 字體不協調、baseline 或行高異常等問題。
