---
globs: ["src/app/actions/**", "src/app/**/actions.ts", "src/app/api/**", "src/lib/**", "supabase/**"]
---

# バックエンド・データベース ルール

## Database Schema (Supabase)

主要テーブル: `profiles`, `posts`, `post_images`, `categories`, `reactions`
- 詳細は `REQUIREMENTS.md` セクション7参照
- RLS（Row Level Security）でアクセス制御
- `reactions` に `(post_id, user_id, type)` のUNIQUE制約

## Server Actions（フォーム処理）

- フォーム送信は Server Actions (`'use server'`) で処理
- クライアント側は `useActionState` でフォーム状態とバリデーションエラーを管理
- Server Action完了後のキャッシュ更新は `revalidatePath()` または `revalidateTag()` を使用
- `redirect()` は `try/catch` ブロックの外で呼び出す
- Server Actionsでは必ずサーバー側でバリデーションを実施（クライアント側バリデーションは補助的）

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

## セキュリティ

- 環境変数: `.env.*` はgitignore済み。ブラウザに公開する変数のみ `NEXT_PUBLIC_` プレフィックスを付与
- Supabase RLSで認証ユーザーのみアクセス制御
- 管理者ロールは `profiles.role = 'admin'` で管理
