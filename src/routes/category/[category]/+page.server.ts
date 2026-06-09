import { getAllPosts } from '$lib/posts';
import type { Post } from '$lib/types';
import { error } from '@sveltejs/kit';

// 💡 params から入力されたカテゴリ（文字列）を受け取る
export async function load({ params }: { params: { category: string } }) {
  const allPosts = await getAllPosts();
  
  // 💡 記事データ（Post型）の category フィールドと URL のパラメータが一致するものを抽出
  // ※お使いの Post 型に category: string が定義されている前提です
  const filteredPosts = allPosts.filter(post => post.category === params.category);

  // 💡 もしそのカテゴリの記事が1件もない場合は404エラーにする（任意）
  if (filteredPosts.length === 0) {
    throw error(404, `カテゴリ「${params.category}」の記事は見つかりませんでした`);
  }

  return { 
    category: params.category, // 💡 画面側で見出し等に使えるよう、カテゴリ名も渡すと便利です
    posts: filteredPosts 
  };
}
