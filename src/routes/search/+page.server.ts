import { getAllPosts } from '$lib/posts';
import type { Post } from '$lib/types';

export async function load({ url }: { url: URL }) {
  const allPosts = await getAllPosts();

  const q = (url.searchParams.get('q') || '').trim();

  if (!q) {
    // クエリが空の場合は空配列を返す（検索ワード入力を促す）
    return { q, posts: [] as Post[] };
  }

  const lower = q.toLowerCase();

  const filteredPosts = allPosts.filter((post) => {
    const title = (post.title || '').toString().toLowerCase();
    const content = (post.content || '').toString().toLowerCase();
    const heading = (post.heading || '').toString().toLowerCase();
    const tags = (post.tags || []).map(t => String(t).toLowerCase());

    return (
      title.includes(lower) ||
      content.includes(lower) ||
      heading.includes(lower) ||
      tags.some(t => t.includes(lower))
    );
  });

  return {
    q,
    posts: filteredPosts
  };
}
