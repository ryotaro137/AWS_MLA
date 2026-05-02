# MLA-C01 学習サイト構築計画

## Context

AWS MLA-C01 試験勉強用リポジトリ（`til/` と `sample_code/`）の内容をブラウザで閲覧できる静的サイトに集約する。日次学習記録（Markdown）とサンプルコード（.ipynb / .py）を美しいUIで一覧・詳細表示できるようにする。

---

## 技術スタック

| 技術 | 役割 |
|---|---|
| **Eleventy v3 (11ty)** | 静的サイトジェネレータ（Markdown → HTML, テンプレートエンジン: Nunjucks） |
| **markdown-it + highlight.js** | MarkdownパーサとコードハイライトのEleventy統合 |
| **lunr + lunr-languages** | クライアントサイド全文検索（日本語対応） |
| **カスタムCSS** | フレームワークなし、ダークテーマ |

---

## 生成サイト構造

```
site/
├── index.html              # ホーム（統計・最新5件TIL・ヒートマップ）
├── til/
│   ├── index.html          # TILタイムライン一覧（降順）
│   └── 2026-04-XX/
│       └── index.html      # 個別TIL詳細（Markdown→HTML, TOC, 前後ナビ）
├── code/
│   └── index.html          # Sample Code一覧 + 各ファイル詳細
├── search/
│   └── index.html          # クライアントサイド全文検索
└── assets/
    ├── css/style.css
    └── js/{search,copy}.js
```

---

## 新規作成ファイル一覧

```
MLA-C01/
├── package.json            ← npm依存関係・scriptsを定義
├── .eleventy.js            ← Eleventy設定（入出力パス・markdown-it統合）
├── src/
│   ├── _data/
│   │   ├── til.js          ← til/2026-*.md をパースしてメタデータ配列を生成
│   │   └── sampleCode.js   ← sample_code/ ファイル一覧とメタデータを生成
│   ├── _includes/
│   │   ├── base.njk        ← HTMLシェル（head・nav・footer共通）
│   │   ├── til-card.njk    ← TILカードコンポーネント
│   │   └── code-card.njk   ← コードファイルカードコンポーネント
│   ├── assets/
│   │   ├── css/style.css   ← ダークテーマCSS（変数・レスポンシブ）
│   │   └── js/
│   │       ├── search.js   ← lunr検索ロジック
│   │       └── copy.js     ← コードブロックコピーボタン
│   ├── index.njk           ← ホームページ
│   ├── til.njk             ← TILタイムライン
│   ├── til/index.njk       ← 個別TILページ（Eleventy Pagination使用）
│   ├── code.njk            ← Sample Codeページ
│   └── search.njk          ← 検索ページ
└── scripts/
    └── prebuild.js         ← ipynb JSONパース → _data/notebooks/*.json
```

**変更する既存ファイル**: `.gitignore`（`site/` と `node_modules/` を追加）

---

## 実装ステップ

### Phase 1: MVP（TIL閲覧機能）

1. `package.json` + `npm install`（依存: `@11ty/eleventy`, `markdown-it`, `markdown-it-anchor`, `highlight.js`, `lunr`, `lunr-languages`）
2. `.eleventy.js` — 入力 `src/`、出力 `site/`、markdown-it + highlight.js 統合
3. `src/_data/til.js` — `glob('../../til/2026-*.md')` でTILファイルを読み込み、日付・トピック一覧（`###` 見出し抽出）・本文テキストのメタデータ配列を返す
4. `src/_includes/base.njk` — HTML共通テンプレート（Google Fonts: Noto Sans JP + JetBrains Mono）
5. `src/index.njk` — 統計バッジ（学習日数・総トピック数）・最新5件TILカード・ヒートマップ
6. `src/til.njk` — 全TIL降順タイムライン（月別セクション・トピックタグ）
7. `src/til/index.njk` — Pagination で各 `2026-04-XX/index.html` を生成、Markdown本文・前後ナビ・TOC
8. `src/assets/css/style.css` — ダークテーマ（`--bg-primary: #0d1117`、AWSオレンジアクセント `#ff9900`）

### Phase 2: Sample Code + 検索

9. `scripts/prebuild.js` — `.ipynb` JSON をパース → コードセル + Markdownセルを `src/_data/notebooks/[name].json` に保存
10. `src/_data/sampleCode.js` — `sample_code/` の全ファイルのメタデータ収集
11. `src/code.njk` — Notebook / Python スクリプト の2セクション一覧、各ファイル詳細ページ（コードハイライト）
12. `scripts/prebuild.js` に検索インデックス生成追加（`src/_data/searchIndex.json`）
13. `src/search.njk` + `src/assets/js/search.js` — lunr全文検索

### Phase 3: UX改善

14. コードブロック コピーボタン（`copy.js`）
15. `.gitignore` 更新（`site/`・`node_modules/` 追加）

---

## 重要な実装注意事項

- **TILフォーマットの揺れ対処**: 4/2 は `# 勉強記録 (2026-04-02)` 形式、4/17以降は `# 勉強日記` + `## 日付` 形式。`til.js` でフォールバック処理（`## 日付` セクションがなければファイル名から日付を取得）
- **日付ファイルのみ対象**: `til.js` は `2026-*.md` パターンでフィルタ（`template.md` 等の除外）
- **ipynb は outputs が空**: SageMaker環境でしか実行できないため `nbconvert --execute` は不使用。代わりに `prebuild.js` でセル単位にJSONパース → テンプレートで直接レンダリング（Stage 3アプローチ）
- **パスの日本語対応**: `__dirname` 基準の相対パスで `path.resolve(__dirname, '../../til/')` を使用

---

## デザイン方針

```css
:root {
  --bg-primary: #0d1117;   /* GitHub dark風 */
  --accent-aws: #ff9900;   /* AWSオレンジ */
  --accent-blue: #58a6ff;  /* リンク */
  --accent-green: #3fb950; /* タグ・バッジ */
}
```

- TILカード: ホバーで左ボーダーがAWSオレンジに光るアニメーション
- ナビバー: 上部固定・半透明 `backdrop-filter: blur(10px)`
- レスポンシブ: mobile(<768px) / tablet(768-1200px) / desktop(>1200px)

---

## 検証方法

1. `npm install` でエラーなく依存パッケージがインストールされる
2. `npm run build` で `site/` に HTML ファイルが生成される
3. `npm run serve` でローカルサーバー起動 → ブラウザで確認
   - `http://localhost:8080/` — ホームページ表示
   - `http://localhost:8080/til/` — TIL一覧（全26エントリ）
   - `http://localhost:8080/til/2026-04-29/` — 最新TIL詳細（Markdown正常レンダリング・コードハイライト）
   - `http://localhost:8080/code/` — Sample Code一覧（11ファイル）
   - `http://localhost:8080/search/` — 検索機能動作確認
