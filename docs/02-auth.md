# 02: 認証機能（Supabase Auth）

> マイルストーン: M1 | 優先度: 最高
> Status: DONE

## 概要

メールアドレス＋パスワードによる認証。教室で先生と一緒に初回登録する想定。
ログインセッションは長期保持（30日以上）。

## 画面

- `/login` — ログイン画面
- `/signup` — アカウント登録画面（ニックネーム入力含む）

## Todo

- [x] Supabase Auth クライアント設定（`@supabase/ssr`）
- [x] 環境変数設定（NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY）
- [x] ログインページ実装
- [x] サインアップページ実装（メール + パスワード + ニックネーム）
- [x] サインアップ時に profiles テーブルへ自動挿入（trigger or Server Action）
- [x] middleware.ts でセッション管理・未認証リダイレクト
- [x] ログアウト機能
- [x] セッション長期保持の設定確認

## 補足

- profiles 自動作成は DB トリガー `handle_new_user()` で実装済み（チケット01）
- Supabase ダッシュボードで「Confirm email」をOFFにする必要あり（教室での即時利用のため）
  - Authentication > Providers > Email > Confirm email を無効化
