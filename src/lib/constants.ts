/** 投稿取得時の共通SELECT文（ハートリアクション付き） */
export const POST_SELECT =
  "id, title, spot_name, area, body_good, body_memo, created_at, profiles(nickname, avatar_url), categories(name, icon, color), post_images(storage_path, order_index), reactions(type, user_id)";

/** 1ページあたりの投稿数 */
export const POSTS_PER_PAGE = 5;
