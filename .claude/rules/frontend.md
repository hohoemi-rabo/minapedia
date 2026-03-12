---
paths: ["src/components/**", "src/app/**/page.tsx", "src/app/**/layout.tsx", "src/app/**/loading.tsx", "src/app/**/error.tsx", "src/app/globals.css", "tailwind.config.ts"]
---

# フロントエンド・UI/UX ルール

## Key Design Decisions

- **モバイルファースト**: スマホ操作が前提。下部固定ナビ3項目（ホーム/投稿/マイページ）+ 管理者は「管理」追加
- **写真なしでも美しいカード**: テーマ別アイコン＋背景カラーで写真不要でも見栄えのよいUI
- **投稿承認制**: 生徒の投稿は `pending` → 管理者が `published` に変更して公開
- **リアクション**: ホームカードではハートマーク（❤️/🤍）のみ。バッジ行の右側に配置
- **コメントなし**: SNS疲れ防止
- **無限スクロール**: IntersectionObserverで画面下部到達時に5件ずつ自動読み込み
- **8テーマ**: おすすめスポット / おいしいもの / 失敗したこと / 昔の思い出 / ありがとう / 教えたいこと / 先生に質問 / つぶやき
- **汎用フォームフィールド**: タイトル（必須）、場所の名前、エリア（南信州14市町村 + その他直接入力）、くわしく教えて、写真
- **リッチ通知**: ConfirmDialog（モーダル確認）+ Toast（自動消去トースト）+ SuccessToast（URL param連動）
- **管理者権限**: 管理者は全投稿の編集・削除が可能（ホームカード・詳細画面両方で操作可能）

## シニア向けアクセシビリティ

- フォントサイズ: 最小16px、本文18px以上推奨
- 高コントラスト配色
- ボタンのタップ領域: 最小48×48px
- エラーメッセージは日本語で平易に表示

## Tailwind CSS

- Tailwind CSS 3.4（v4ではない）を使用
- カスタムカラー: `background` / `foreground`（CSS変数ベース）
- フォントファミリー: `sans`（M PLUS Rounded 1c — ポップな丸ゴシック）

## コンポーネント設計

- コンポーネントはデフォルトでServer Component。`useState`, `useEffect`, イベントハンドラが必要な場合のみ `'use client'` を付与
- Client Componentは末端（リーフ）に配置し、`'use client'` 境界を最小限に保つ
- 画像は `next/image` の `<Image>` コンポーネントを使用（自動最適化、WebP/AVIF変換、レイアウトシフト防止）
- 楽観的UI更新は `useOptimistic` + `useTransition` パターンを使用（例: HeartButton）

## 主要コンポーネント

- `PostCard` — 投稿カード（Server Component）。ハートボタン・アバター・インライン詳細展開を内包。`canEdit` propで管理者の編集・削除ボタン表示
- `PostCardDetail` — カード内アコーディオン展開（Client Component）。「続きを読む」で詳細表示。`canEdit` 時に編集・削除ボタン付き
- `PostFeed` — テーマフィルタ（3列カプセル型グリッド）+ 投稿一覧 + もっと見るボタン（Client Component）。`isAdmin` propで管理者権限伝播
- `PostForm` — 投稿作成・編集フォーム（Client Component）。画像圧縮・プレビュー付き。エリアは南信州14市町村 + その他直接入力
- `HeartButton` — ハートリアクションのトグルボタン（Client Component）
- `Avatar` — アバター表示（Server Component）。画像 or ニックネーム頭文字。sm/md/lgサイズ対応
- `AvatarInput` — アバターアップロード・削除UI（Client Component）。画像圧縮付き
- `BottomNav` — 下部固定ナビ。管理者には「管理」リンク追加（`isAdmin` prop）
- `ImageCarousel` — 詳細ページの画像スワイプカルーセル
- `ConfirmDialog` — モーダル確認ダイアログ（Client Component）。`danger`/`info` バリアント。`window.confirm` の代替
- `Toast` — 画面上部トースト通知（Client Component）。3秒で自動消去。`success`/`error` バリアント
- `SuccessToast` — URL `?message=` パラメータ連動のトースト（Client Component）。投稿・更新後のフィードバック表示
- `DeletePostButton` — 投稿削除ボタン（Client Component）。`size="sm"`（マイページ inline）/ `size="lg"`（詳細画面）。ConfirmDialog付き
