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

const POSTS_PER_PAGE = 5;

export function PostFeed({
  initialPosts,
  initialHasMore,
  categories,
}: {
  initialPosts: Post[];
  initialHasMore: boolean;
  categories: Category[];
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    startTransition(async () => {
      const result = await fetchPosts({
        offset: 0,
        limit: POSTS_PER_PAGE,
        categoryId: categoryId ?? undefined,
      });
      setPosts(result.posts as Post[]);
      setHasMore(result.hasMore);
    });
  };

  const handleLoadMore = () => {
    startTransition(async () => {
      const result = await fetchPosts({
        offset: posts.length,
        limit: POSTS_PER_PAGE,
        categoryId: selectedCategory ?? undefined,
      });
      setPosts((prev) => [...prev, ...(result.posts as Post[])]);
      setHasMore(result.hasMore);
    });
  };

  return (
    <section className="mt-8">
      {/* テーマフィルタ */}
      <h2 className="text-xl font-bold">テーマで絞る</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleCategoryChange(null)}
          className={`rounded-full px-4 py-2 text-base font-medium transition-colors ${
            selectedCategory === null
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          すべて
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryChange(cat.id)}
            className={`rounded-full px-4 py-2 text-base font-medium transition-colors ${
              selectedCategory === cat.id
                ? "text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={
              selectedCategory === cat.id
                ? { backgroundColor: cat.color }
                : undefined
            }
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* 投稿一覧 */}
      <h2 className="mt-8 text-xl font-bold">みんなの新着</h2>
      {posts.length > 0 ? (
        <div className="mt-4 space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
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
