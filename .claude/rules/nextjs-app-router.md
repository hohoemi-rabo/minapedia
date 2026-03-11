---
paths: ["src/app/**", "next.config.ts", "src/middleware.ts"]
---

# Next.js 15 App Router ベストプラクティス

## ルーティング規約（ファイルベース）

- `page.tsx` — ページコンポーネント
- `layout.tsx` — 共有レイアウト（ナビゲーション等）。ナビゲーション時に再レンダリングされない
- `loading.tsx` — Suspenseベースのローディング UI
- `error.tsx` — エラーバウンダリ（`'use client'` 必須）
- `not-found.tsx` — 404ページ

## データフェッチ戦略

```tsx
// 静的データ（デフォルト・キャッシュ有効）
const data = await fetch(url, { cache: 'force-cache' })

// 動的データ（リクエスト毎に再取得）
const data = await fetch(url, { cache: 'no-store' })

// 時間ベース再検証（ISR相当）
const data = await fetch(url, { next: { revalidate: 60 } })
```

- Server Componentでデータフェッチを行い、結果をpropsとしてClient Componentに渡す
- Supabaseクライアントを使う場合も同様の考え方でキャッシュ戦略を意識する

## Client Component フォームパターン

```tsx
'use client'
import { useActionState } from 'react'
import { createPost } from '@/app/actions'

export function PostForm() {
  const [state, action, pending] = useActionState(createPost, undefined)
  return (
    <form action={action}>
      {/* フォームフィールド */}
      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button disabled={pending}>投稿する</button>
    </form>
  )
}
```

## パフォーマンス最適化

- **メタデータ**: Metadata API (`export const metadata` / `generateMetadata`) でSEO対応
- **Layouts**: 共通UIはlayoutに配置し、ナビゲーション時の部分レンダリングを活用
- **フォント**: `next/font` で M PLUS Rounded 1c をセルフホスト（設定済み）
- **React.cache()**: `src/lib/auth.ts` で認証・プロフィール取得をリクエスト内デデュプリケーション
- **Promise.all()**: 独立したデータフェッチを並列実行（ウォーターフォール排除）
- **動的import**: 重いライブラリ（`browser-image-compression`）は使用時に動的import
