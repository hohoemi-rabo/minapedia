# 11: 管理画面 — 投稿承認

> マイルストーン: M4 | 優先度: 高

## 概要

管理者（先生）が生徒の投稿を確認し、公開/差し戻し/非表示を管理する画面。
`profiles.role = 'admin'` のユーザーのみアクセス可能。

## 機能

- pending 投稿の一覧表示
- 投稿内容のプレビュー
- 「公開する」ボタン → status を `published` に変更
- 「差し戻す」ボタン → status を `hidden` に変更（個人情報記載など）
- 全投稿のステータス管理（published → hidden の変更も可能）

## Todo

- [ ] `/admin` レイアウト作成（admin ロールチェック）
- [ ] `/admin/posts` 投稿管理ページ
- [ ] pending 投稿一覧（優先表示）
- [ ] 投稿プレビュー表示
- [ ] 承認 Server Action（pending → published）
- [ ] 差し戻し/非表示 Server Action（→ hidden）
- [ ] ステータス変更後の revalidatePath
