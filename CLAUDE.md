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
- **Fonts**: M PLUS Rounded 1c（丸ゴシック、next/font/google）

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
  - `(auth)/` — 認証関連（login, signup）
  - `(main)/` — メイン画面（ホーム, 投稿, マイページ, 管理画面）
- `src/components/` — 共有コンポーネント
- `src/lib/supabase/` — Supabase クライアント（server.ts / client.ts / storage.ts）
- CSS変数ベースのテーマ管理 (`--background`, `--foreground`)
- 詳細ルールは `.claude/rules/` に分割管理（frontend / backend / nextjs-app-router）

## Key Implementation Details

- `posts.id` は UUID（string型）。Number() キャストは禁止
- Supabase JOIN はオブジェクトまたは配列を返すため、`Array.isArray()` で分岐が必要
- 画像圧縮は `browser-image-compression` でクライアント側実施
- アバター画像はタイムスタンプ付きファイル名（`user_id/{timestamp}`）でキャッシュ問題を回避
- Supabase Storage バケット: `post-images`（投稿画像）、`avatars`（アバター画像）
- Server Actions body上限: 5MB（`next.config.ts` で設定）
- Supabase project ID: `slfdutaanuoswrofcomv`
- エリア選択: 南信州14市町村（飯田市, 松川町, 高森町, 阿南町, 阿智村, 平谷村, 根羽村, 下條村, 売木村, 天龍村, 泰阜村, 喬木村, 豊丘村, 大鹿村）

## Ticket Management

開発チケットは `docs/` 配下で管理。ファイル先頭に連番。

| チケット | 内容 | マイルストーン | 状態 |
|---------|------|-------------|------|
| 01 | Supabase DB設計・構築 | M1 | DONE |
| 02 | 認証機能（Supabase Auth） | M1 | DONE |
| 03 | 共通レイアウト・下部固定ナビ | M1-M2 | DONE |
| 04 | 投稿フォーム | M2 | DONE |
| 05 | 写真アップロード | M2 | DONE |
| 06 | 投稿カードコンポーネント | M2 | DONE |
| 07 | ホーム画面（みんなの新着） | M3 | DONE |
| 08 | 投稿詳細画面 | M3 | DONE |
| 09 | リアクション機能 | M3 | DONE |
| 10 | マイページ | M3 | DONE |
| 11 | 管理画面 — 投稿承認 | M4 | DONE |
| 12 | 管理画面 — おすすめ固定 | M4 | DONE |
| 13 | アクセシビリティ・テスト・デプロイ | M5 | TODO |

### Todo ルール

- 各チケットの Todo は `- [ ]` で管理
- 完了したら `- [x]` に更新する
- チケット内の全 Todo が完了したら、チケットファイル先頭に `> Status: DONE` を追記

## Conventions

- 出力は日本語で提供
- コミットメッセージはConventional Commits形式（英語）
- ESLint: `next/core-web-vitals` + `next/typescript`
