---
paths: ["src/app/actions/**", "src/app/**/actions.ts", "src/app/api/**", "src/lib/**", "supabase/**"]
---

# バックエンド・データベース ルール

## Database Schema (Supabase)

主要テーブル: `profiles`, `posts`, `post_images`, `categories`, `reactions`
- `posts.id` は UUID（string型）。Number() キャストは禁止
- `profiles.avatar_url` — アバター画像のStorageパス（nullable）
- RLS（Row Level Security）でアクセス制御
- `reactions` に `(post_id, user_id, type)` のUNIQUE制約
- Supabase JOIN（例: `profiles(nickname, avatar_url)`）はオブジェクトまたは配列を返すため、`Array.isArray()` で分岐が必要
- 管理者機能: 投稿承認（pending → published）、おすすめ固定（最大3件）、全投稿の編集・削除
- `post_images`, `reactions` は `posts` に ON DELETE CASCADE（投稿削除時に自動削除）

## Database Functions (RPC)

- `toggle_reaction(p_post_id, p_type)` — リアクションのアトミックなトグル。DELETE→INSERT パターンでレースコンディション防止。`supabase.rpc("toggle_reaction", { p_post_id, p_type })` で呼び出し
- `is_admin()` — 管理者判定ヘルパー関数（SECURITY DEFINER）。RLSポリシー内で `(select public.is_admin())` として使用

## RLS ベストプラクティス

- `auth.uid()` は必ず `(select auth.uid())` で呼び出す（行ごとの再評価を防止、5-10x高速化）
- 管理者チェックは `is_admin()` 関数に集約（保守性 + パフォーマンス）
- RLSポリシーで使用するカラムには必ずインデックスを追加

## Supabase Storage

- バケット: `post-images`（投稿画像）、`avatars`（アバター画像、public）
- アバターはタイムスタンプ付きファイル名（`user_id/{timestamp}`）でキャッシュ問題を回避
- アバター更新時は古いファイル削除と新ファイルアップロードを `Promise.all()` で並列実行
- RLSポリシー: 自分のフォルダ（`user_id/`）のみ操作可能

## Server Actions（フォーム処理）

- フォーム送信は Server Actions (`'use server'`) で処理
- クライアント側は `useActionState` でフォーム状態とバリデーションエラーを管理
- Server Action完了後のキャッシュ更新は `revalidatePath()` または `revalidateTag()` を使用
- `redirect()` は `try/catch` ブロックの外で呼び出す
- Server Actionsでは必ずサーバー側でバリデーションを実施（クライアント側バリデーションは補助的）
- 独立した操作は `Promise.all()` で並列実行（例: Storage削除 + DB削除）

```tsx
// Server Action パターン
'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(prevState: any, formData: FormData) {
  // バリデーション・DB操作
  if (!valid) return { message: 'エラーメッセージ' }
  revalidatePath('/posts')
  redirect('/posts')
}
```

## データアクセスパターン

- ページネーションはカーソルベース（`.lt("created_at", cursor)`）。OFFSETは使用しない
- 共通SELECT文は `src/lib/constants.ts` の `POST_SELECT` 定数を使用（DRY原則）
- 認証・プロフィール取得は `src/lib/auth.ts` の `getAuthUser()` / `getProfile()` を使用（`React.cache()` でリクエスト内デデュプリケーション）

## セキュリティ

- 環境変数: `.env.*` はgitignore済み。ブラウザに公開する変数のみ `NEXT_PUBLIC_` プレフィックスを付与
- Supabase RLSで認証ユーザーのみアクセス制御
- 管理者ロールは `profiles.role = 'admin'` で管理
- 管理画面は `src/app/(main)/admin/layout.tsx` でロールガード（非adminは `notFound()`）
- Server Actionsでは `requireAdmin()` ヘルパーで権限チェック
- 投稿の編集・削除は本人 or 管理者（Server Actionで並列に権限チェック）
- 投稿完了後は `redirect("/?message=posted")` / `redirect("/?message=updated")` でホームにトースト表示

## カテゴリ（テーマ）

8種（`categories` テーブル、`phase=1` でフィルタ）:
1. おすすめスポット 2. おいしいもの 3. 失敗したこと 4. 昔の思い出
5. ありがとう 6. 教えたいこと 7. 先生に質問 8. つぶやき
