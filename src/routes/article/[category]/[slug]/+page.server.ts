import { getPostBySlug } from '$lib/posts';
import { error } from '@sveltejs/kit';
import type { Post } from '$lib/types';
import { marked } from 'marked';

export async function load({ params }: { params: { category: string; slug: string } }) {
	const post: Post | undefined = await getPostBySlug(params.slug);
	
	if (!post) {
		throw error(404, '記事が見つかりません');
	}

	if (post.category !== params.category){
		throw error(404, 'error_test')
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