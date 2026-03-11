# 05: 写真アップロード

> マイルストーン: M2 | 優先度: 高
> Status: DONE

## 概要

投稿フォームに組み込む画像アップロード機能。0〜3枚まで。
クライアント側で圧縮処理を行い、Supabase Storageへ保存。

## 技術要件

- `browser-image-compression` でクライアント側圧縮（平均500KB/枚目標）
- Supabase Storage の `post-images` バケットへアップロード
- `post_images` テーブルに storage_path と order_index を記録

## Todo

- [x] `browser-image-compression` パッケージ導入
- [x] 画像プレビュー付きアップロードコンポーネント作成（Client Component）
- [x] クライアント側画像圧縮処理
- [x] Supabase Storage へのアップロード処理
- [x] post_images テーブルへの記録（投稿作成 Server Action に統合）
- [x] 3枚上限のバリデーション
- [x] アップロード中のローディング表示
