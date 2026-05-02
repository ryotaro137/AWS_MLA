# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

AWS MLA-C01（Machine Learning Engineer - Associate）試験の学習記録を管理・公開するための静的サイトジェネレーターリポジトリ。毎日の学習内容を `til/` フォルダにMarkdownで記録し、Eleventy（11ty）でWebサイトとしてビルドする。

## ビルド・開発コマンド

```bash
npm run build    # prebuild（ノートブック解析・検索インデックス生成）→ Eleventy ビルド
npm run serve    # ローカル開発サーバー起動（ファイル変更を自動検知）
npm run clean    # site/ を削除してクリーンアップ
```

`npm run build` は内部で `scripts/prebuild.js` を実行してから Eleventy を走らせる。ビルド成果物（`site/`、`src/_data/notebooks/`、`src/_data/searchIndex.json`）は `.gitignore` で除外されている。

## アーキテクチャ

### データフロー

```
til/*.md          ─┐
sample_code/*.ipynb ─┤→ scripts/prebuild.js → src/_data/notebooks/*.json
                    │                        src/_data/searchIndex.json
                    │
src/_data/*.js ──── ┘→ Eleventy → site/
src/_includes/
src/*.njk
```

### 主要ディレクトリ

| パス | 役割 |
| --- | --- |
| `til/` | 日次学習Markdownファイル（`YYYY-MM-DD.md`形式） |
| `sample_code/` | Jupyter Notebook（`.ipynb`）と Pythonスクリプト（`.py`） |
| `src/_data/` | Eleventyのデータローダー（JS）と生成ファイル |
| `src/_includes/` | Nunjucksテンプレート（`base.njk`, `til-card.njk`, `code-card.njk`） |
| `src/assets/` | CSS・JSなどの静的ファイル（パススルーコピー） |
| `reference/` | 参考PDF資料（AWS Black Belt等） |
| `.agent/skills/mla-practical/` | Claude用カスタムスキル定義 |

### データローダー（`src/_data/`）

- **`til.js`**: `til/` フォルダのMarkdownを読み込み、日付・トピック・本文を抽出してリスト返却
- **`sampleCode.js`**: `sample_code/` のファイルを読み込み、`prebuild.js` が生成したJSONからノートブック情報を取得
- **`notebooks.js`** / **`pythonFiles.js`**: ノートブック・Pythonファイルのデータ個別提供

### `prebuild.js` の役割

1. `sample_code/*.ipynb` をパースして `src/_data/notebooks/{slug}.json` に出力
2. `til/*.md` と `sample_code/` を対象にLunr向け検索インデックスを生成し `src/_data/searchIndex.json` に出力

## TIL ファイルの記述形式

`til/YYYY-MM-DD.md` を作成する際は以下の構造に従う（`src/_data/til.js` がこのフォーマットを前提にパースする）。

```markdown
# 勉強日記

## 日付
YYYY年MM月DD日

## 学習内容

### [サービス名/トピック名]
- **概要**: [1〜2行での説明]
- **試験ポイント**: [試験で問われやすい要点]
- **実務での使い方**: [現場でのMLOps観点での構成パターンや設計のコツ]
- **副業での需要**: [需要度★と、よくある案件例]
```

- 同じトピックが以前のファイルと被る場合は新規ファイルを作らず、既存ファイルの `## 日付` セクションに日付を追記してアップデートする
- トピック見出し（`### [...]`）は `til.js` がパースしてカード表示に使う

## Claude スキル（`.agent/skills/mla-practical/`）

MLA-C01の学習支援用カスタムスキル。AWSサービスや用語について質問された際に**3軸**で回答する。

1. **試験での出題ポイント（MLA-C01）**: 出題傾向・引っ掛けパターン・類似サービスとの比較
2. **実務でのユースケース**: ETL〜MLOpsの連携パターン・セキュリティベストプラクティス
3. **副業案件での需要度**: 需要度（★数）・具体的な案件例・単価感

副業需要の詳細は `.agent/skills/mla-practical/references/freelance-aws-domains.md` を参照。
