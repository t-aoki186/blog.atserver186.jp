import { getPostBySlug } from '$lib/posts';
import { error } from '@sveltejs/kit';
import type { Post } from '$lib/types';
import { marked } from 'marked';

export async function load({ params }: { params: { slug: string } }) {
	const post: Post | undefined = await getPostBySlug(params.slug);
	
	if (!post) {
		throw error(404, '記事が見つかりません');
	}
	
	// markedでマークダウンをHTMLに変換
	const htmlContent = await marked(post.content);
	
	return { 
		post: {
			...post,
			html: htmlContent
		}
	};
}