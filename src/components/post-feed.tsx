"use client";

import { useState, useTransition } from "react";
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
}: {
  initialPosts: PostWithHeart[];
  initialHasMore: boolean;
  categories: Category[];
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

  const handleLoadMore = () => {
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
  };

  return (
    <section className="mt-8">
      {/* テーマフィルタ */}
      <h2 className="text-xl font-bold">テーマで絞る</h2>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => handleCategoryChange(null)}
          className={`flex items-center justify-center rounded-full border-2 px-2 py-2.5 text-sm font-medium transition-colors ${
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
            className={`flex items-center gap-1.5 rounded-full border-2 px-2 py-2.5 text-sm font-medium transition-colors ${
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
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-center text-gray-500">
          {isPending ? "読み込み中..." : "まだ投稿がありません。"}
        </p>
      )}

      {/* もっと見る */}
      {hasMore && (
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={isPending}
          className="mt-6 w-full rounded-lg border-2 border-gray-300 px-4 py-4 text-lg font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50"
        >
          {isPending ? "読み込み中..." : "もっと見る"}
        </button>
      )}
    </section>
  );
}
