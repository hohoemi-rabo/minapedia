# 01: Supabase DB設計・構築

> マイルストーン: M1 | 優先度: 最高

## 概要

REQUIREMENTS.md セクション7に基づき、Supabase上にテーブル・RLS・Storageを構築する。

## 対象テーブル

- `profiles` — ユーザー情報（Supabase Auth連携）
- `posts` — 投稿データ
- `post_images` — 投稿画像
- `categories` — テーマ（初期データ投入含む）
- `reactions` — リアクション（UNIQUE制約: post_id, user_id, type）

## Todo

- [ ] profiles テーブル作成（id は auth.users.id と連携）
- [ ] posts テーブル作成（status: pending/published/hidden）
- [ ] post_images テーブル作成
- [ ] categories テーブル作成 + 初期データ投入（6テーマ）
- [ ] reactions テーブル作成 + UNIQUE制約
- [ ] 各テーブルの RLS ポリシー設定
- [ ] Supabase Storage バケット作成（post-images）
- [ ] Storage の RLS ポリシー設定（認証ユーザーのみアップロード可）
