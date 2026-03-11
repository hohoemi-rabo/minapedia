# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Minapedia（ミナペディア）— 南信州のシニア向けクローズドSNS。パソコン教室「ほほえみラボ」の生徒が日常の体験・気づきを記録・共有するプラットフォーム。将来的に蓄積データを活用した南信州特化AIチャットボット開発を目指す。

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **UI**: React 19 + Tailwind CSS 3.4
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage)
- **Hosting**: Vercel
- **Fonts**: Geist Sans / Geist Mono (next/font)

## Commands

```bash
npm run dev          # 開発サーバー起動 (Turbopack)
npm run build        # プロダクションビルド (Turbopack)
npm run start        # プロダクションサーバー起動
npm run lint         # ESLint実行 (eslint)
```

## Path Aliases

`@/*` → `./src/*` (tsconfig.json)

## Architecture

- `src/app/` — Next.js App Router (pages, layouts, API routes)
- CSS変数ベースのテーマ管理 (`--background`, `--foreground`) でダークモード対応
- 詳細ルールは `.claude/rules/` に分割管理（frontend / backend / nextjs-app-router）

## Ticket Management

開発チケットは `docs/` 配下で管理。ファイル先頭に連番。

| チケット | 内容 | マイルストーン |
|---------|------|-------------|
| 01 | Supabase DB設計・構築 | M1 |
| 02 | 認証機能（Supabase Auth） | M1 |
| 03 | 共通レイアウト・下部固定ナビ | M1-M2 |
| 04 | 投稿フォーム | M2 |
| 05 | 写真アップロード | M2 |
| 06 | 投稿カードコンポーネント | M2 |
| 07 | ホーム画面（みんなの新着） | M3 |
| 08 | 投稿詳細画面 | M3 |
| 09 | リアクション機能 | M3 |
| 10 | マイページ | M3 |
| 11 | 管理画面 — 投稿承認 | M4 |
| 12 | 管理画面 — おすすめ固定 | M4 |
| 13 | アクセシビリティ・テスト・デプロイ | M5 |

### Todo ルール

- 各チケットの Todo は `- [ ]` で管理
- 完了したら `- [x]` に更新する
- チケット内の全 Todo が完了したら、チケットファイル先頭に `> Status: DONE` を追記

## Conventions

- 出力は日本語で提供
- コミットメッセージはConventional Commits形式（英語）
- ESLint: `next/core-web-vitals` + `next/typescript`
