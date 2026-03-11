"use client";

import { useActionState, useState } from "react";
import { createPost, type PostFormState } from "@/app/(main)/posts/new/actions";
import { ImageInput } from "@/components/image-input";

type Category = {
  id: number;
  name: string;
  icon: string;
  color: string;
};

const AREAS = ["飯田市", "高森町", "阿智村", "松川町", "その他"] as const;

const inputClass =
  "mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

export function PostForm({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState<PostFormState, FormData>(
    createPost,
    undefined
  );
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
        投稿は先生が確認してから表示されます。安心して投稿してくださいね。
      </div>

      <form action={action} className="space-y-6">
        {state?.message && (
          <div
            className="rounded-lg bg-red-50 p-4 text-red-700"
            role="alert"
            aria-live="polite"
          >
            {state.message}
          </div>
        )}

        <input type="hidden" name="category_id" value={selectedCategory ?? ""} />

        {/* 写真 */}
        <ImageInput disabled={pending} />

        {/* テーマ選択 */}
        <fieldset>
          <legend className="text-lg font-medium text-foreground">
            テーマを選んでください <span className="text-red-500">*</span>
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 rounded-lg border-2 px-4 py-3 text-left text-base transition-colors ${
                  selectedCategory === cat.id
                    ? "border-blue-500 bg-blue-50 font-bold"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-gray-900">{cat.name}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* タイトル */}
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-foreground">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={100}
            className={inputClass}
            placeholder="例: 天龍峡のカフェに行ってきました"
          />
        </div>

        {/* 場所の名前 */}
        <div>
          <label htmlFor="spot_name" className="block text-lg font-medium text-foreground">
            場所の名前
          </label>
          <input
            id="spot_name"
            name="spot_name"
            type="text"
            className={inputClass}
            placeholder="例: 〇〇喫茶店"
          />
        </div>

        {/* エリア */}
        <div>
          <label htmlFor="area" className="block text-lg font-medium text-foreground">
            エリア
          </label>
          <select
            id="area"
            name="area"
            className={inputClass}
            defaultValue=""
          >
            <option value="">選択してください</option>
            {AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* どこがよかった？ */}
        <div>
          <label htmlFor="body_good" className="block text-lg font-medium text-foreground">
            どこがよかった？
          </label>
          <textarea
            id="body_good"
            name="body_good"
            rows={3}
            className={inputClass}
            placeholder="例: 歩きやすかった、ケーキが美味しかった"
          />
        </div>

        {/* ひとこと感想 */}
        <div>
          <label htmlFor="body_memo" className="block text-lg font-medium text-foreground">
            ひとこと感想
          </label>
          <textarea
            id="body_memo"
            name="body_memo"
            rows={3}
            className={inputClass}
            placeholder="例: また春にも行ってみたいです"
          />
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-blue-600 px-4 py-4 text-lg font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {pending ? "送信中..." : "先生に送る（投稿する）"}
        </button>
      </form>
    </div>
  );
}
