"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { PostCard, type Post } from "@/components/post-card";
import { fetchPosts } from "@/app/(main)/actions";

type Category = {
  id: number;
  name: string;
  icon: string;
  color: string;
};

type PostWithHeart = Post & {
  heartCount?: number;
  heartReacted?: boolean;
};

const POSTS_PER_PAGE = 5;

export function PostFeed({
  initialPosts,
  initialHasMore,
  categories,
  isAdmin = false,
}: {
  initialPosts: PostWithHeart[];
  initialHasMore: boolean;
  categories: Category[];
  isAdmin?: boolean;
}) {
  const [posts, setPosts] = useState<PostWithHeart[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    startTransition(async () => {
      const result = await fetchPosts({
        limit: POSTS_PER_PAGE,
        categoryId: categoryId ?? undefined,
      });
      setPosts(result.posts as PostWithHeart[]);
      setHasMore(result.hasMore);
    });
  };

  const handleLoadMore = useCallback(() => {
    startTransition(async () => {
      const lastPost = posts[posts.length - 1];
      const result = await fetchPosts({
        limit: POSTS_PER_PAGE,
        categoryId: selectedCategory ?? undefined,
        cursor: lastPost?.created_at,
      });
      setPosts((prev) => [...prev, ...(result.posts as PostWithHeart[])]);
      setHasMore(result.hasMore);
    });
  }, [posts, selectedCategory]);

  // 無限スクロール: 番兵要素が画面内に入ったら自動読み込み
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isPending) {
          handleLoadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isPending, handleLoadMore]);

  return (
    <section className="mt-8">
      {/* テーマフィルタ */}
      <h2 className="text-xl font-bold">テーマで絞る</h2>
      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
        <button
          type="button"
          onClick={() => handleCategoryChange(null)}
          className={`shrink-0 rounded-full border-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            selectedCategory === null
              ? "border-blue-500 bg-blue-50 font-bold"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <span className="text-gray-900">すべて</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryChange(cat.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? "border-blue-500 bg-blue-50 font-bold"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs"
              style={{ backgroundColor: cat.color }}
            >
              {cat.icon}
            </span>
            <span className="text-gray-900">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 投稿一覧 */}
      <h2 className="mt-8 text-xl font-bold">みんなの新着</h2>
      {posts.length > 0 ? (
        <div className="mt-4 space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              heartCount={post.heartCount}
              heartReacted={post.heartReacted}
              canEdit={isAdmin}
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-center text-gray-500">
          {isPending ? "読み込み中..." : "まだ投稿がありません。"}
        </p>
      )}

      {/* 無限スクロール番兵 + ローディング表示 */}
      <div ref={sentinelRef} className="mt-6 flex justify-center py-4">
        {isPending && (
          <span className="text-gray-500">読み込み中...</span>
        )}
      </div>
    </section>
  );
}
