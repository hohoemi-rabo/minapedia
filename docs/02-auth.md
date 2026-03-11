# 02: 認証機能（Supabase Auth）

> マイルストーン: M1 | 優先度: 最高

## 概要

メールアドレス＋パスワードによる認証。教室で先生と一緒に初回登録する想定。
ログインセッションは長期保持（30日以上）。

## 画面

- `/login` — ログイン画面
- `/signup` — アカウント登録画面（ニックネーム入力含む）

## Todo

- [ ] Supabase Auth クライアント設定（`@supabase/ssr`）
- [ ] 環境変数設定（NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY）
- [ ] ログインページ実装
- [ ] サインアップページ実装（メール + パスワード + ニックネーム）
- [ ] サインアップ時に profiles テーブルへ自動挿入（trigger or Server Action）
- [ ] middleware.ts でセッション管理・未認証リダイレクト
- [ ] ログアウト機能
- [ ] セッション長期保持の設定確認
