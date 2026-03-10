---
globs: ["src/components/**", "src/app/**/page.tsx", "src/app/**/layout.tsx", "src/app/**/loading.tsx", "src/app/**/error.tsx", "src/app/globals.css", "tailwind.config.ts"]
---

# フロントエンド・UI/UX ルール

## Key Design Decisions (REQUIREMENTS.md)

- **モバイルファースト**: スマホ操作が前提。下部固定ナビ3項目（ホーム/投稿/マイページ）
- **写真なしでも美しいカード**: テーマ別アイコン＋背景カラーで写真不要でも見栄えのよいUI
- **投稿承認制**: 生徒の投稿は `pending` → 管理者が `published` に変更して公開
- **コメントなし・いいね数非表示**: SNS疲れ防止。リアクション3種のみ（すてき/行ってみたい/参考になった）
- **無限スクロール禁止**: 「もっと見る」ボタンで5件ずつ追加読み込み

## シニア向けアクセシビリティ

- フォントサイズ: 最小16px、本文18px以上推奨
- 高コントラスト配色
- ボタンのタップ領域: 最小48×48px
- エラーメッセージは日本語で平易に表示

## Tailwind CSS

- Tailwind CSS 3.4（v4ではない）を使用
- カスタムカラー: `background` / `foreground`（CSS変数ベース）
- フォントファミリー: `sans`（Geist Sans）/ `mono`（Geist Mono）

## コンポーネント設計

- コンポーネントはデフォルトでServer Component。`useState`, `useEffect`, イベントハンドラが必要な場合のみ `'use client'` を付与
- Client Componentは末端（リーフ）に配置し、`'use client'` 境界を最小限に保つ
- 画像は `next/image` の `<Image>` コンポーネントを使用（自動最適化、WebP/AVIF変換、レイアウトシフト防止）
