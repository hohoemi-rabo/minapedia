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

## Conventions

- 出力は日本語で提供
- コミットメッセージはConventional Commits形式（英語）
- ESLint: `next/core-web-vitals` + `next/typescript`
