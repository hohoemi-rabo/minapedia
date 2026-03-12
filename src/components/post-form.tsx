"use client";

import { useActionState, useState } from "react";
import { createPost, type PostFormState } from "@/app/(main)/posts/new/actions";
import { updatePost } from "@/app/(main)/posts/[id]/actions";
import { ImageInput } from "@/components/image-input";

type Category = {
  id: number;
  name: string;
  icon: string;
  color: string;
};

type DefaultValues = {
  title: string;
  category_id: number;
  spot_name: string | null;
  area: string | null;
  body_good: string | null;
  body_memo: string | null;
  post_images: { storage_path: string; order_index: number }[];
};

const AREAS = [
  "飯田市",
  "松川町",
  "高森町",
  "阿南町",
  "阿智村",
  "平谷村",
  "根羽村",
  "下條村",
  "売木村",
  "天龍村",
  "泰阜村",
  "喬木村",
  "豊丘村",
  "大鹿村",
] as const;

const inputClass =
  "mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-lg text-gray-900 placeholder:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

export function PostForm({
  categories,
  mode = "create",
  postId,
  defaultValues,
}: {
  categories: Category[];
  mode?: "create" | "edit";
  postId?: number;
  defaultValues?: DefaultValues;
}) {
  const serverAction = mode === "edit" ? updatePost : createPost;
  const [state, action, pending] = useActionState<PostFormState, FormData>(
    serverAction,
    undefined
  );
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    defaultValues?.category_id ?? null
  );

  const defaultArea = defaultValues?.area ?? "";
  const isDefaultOther = defaultArea !== "" && !AREAS.includes(defaultArea as typeof AREAS[number]);
  const [areaSelect, setAreaSelect] = useState(isDefaultOther ? "other" : defaultArea);
  const [areaOther, setAreaOther] = useState(isDefaultOther ? defaultArea : "");

  return (
    <div className="space-y-6">
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
        {mode === "edit" && postId && (
          <input type="hidden" name="post_id" value={postId} />
        )}

        {/* テーマ選択 */}
        <fieldset>
          <legend className="text-lg font-medium text-gray-900">
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
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-lg"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.icon}
                </span>
                <span className="text-gray-900">{cat.name}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* タイトル */}
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-900">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={100}
            defaultValue={defaultValues?.title ?? ""}
            className={inputClass}
            placeholder="例: 天龍峡のカフェに行ってきました"
          />
        </div>

        {/* 場所の名前 */}
        <div>
          <label htmlFor="spot_name" className="block text-lg font-medium text-gray-900">
            場所の名前
          </label>
          <input
            id="spot_name"
            name="spot_name"
            type="text"
            defaultValue={defaultValues?.spot_name ?? ""}
            className={inputClass}
            placeholder="例: 〇〇喫茶店"
          />
        </div>

        {/* エリア */}
        <div>
          <label htmlFor="area_select" className="block text-lg font-medium text-gray-900">
            エリア
          </label>
          <select
            id="area_select"
            className={inputClass}
            value={areaSelect}
            onChange={(e) => {
              setAreaSelect(e.target.value);
              if (e.target.value !== "other") {
                setAreaOther("");
              }
            }}
          >
            <option value="">選択してください</option>
            {AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
            <option value="other">その他（直接入力）</option>
          </select>
          {areaSelect === "other" && (
            <input
              type="text"
              value={areaOther}
              onChange={(e) => setAreaOther(e.target.value)}
              className={inputClass}
              placeholder="例: 東京都、名古屋市"
            />
          )}
          <input
            type="hidden"
            name="area"
            value={areaSelect === "other" ? areaOther : areaSelect}
          />
        </div>

        {/* くわしく教えて */}
        <div>
          <label htmlFor="body_good" className="block text-lg font-medium text-gray-900">
            くわしく教えて
          </label>
          <textarea
            id="body_good"
            name="body_good"
            rows={4}
            defaultValue={defaultValues?.body_good ?? ""}
            className={inputClass}
            placeholder="例: こんなことがありました…"
          />
        </div>

        {/* 写真 */}
        <ImageInput
          disabled={pending}
          existingImages={defaultValues?.post_images}
        />

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-blue-600 px-4 py-4 text-lg font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {pending
            ? "送信中..."
            : mode === "edit"
              ? "更新する"
              : "先生に送る（投稿する）"}
        </button>
      </form>
    </div>
  );
}
