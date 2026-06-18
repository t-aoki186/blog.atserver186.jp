import { getPostBySlug } from '$lib/posts';
import { error } from '@sveltejs/kit';
import type { Post } from '$lib/types';
import { marked } from 'marked';
import { readFileSync } from 'fs';
import { join } from 'path';
import fm from 'front-matter';
import type { FrontMatter } from '$lib/types';

export async function load({ params }: { params: { category: string; slug: string } }) {
	let post: Post | undefined = await getPostBySlug(params.slug);
	
	if (!post) {
		throw error(404, '記事が見つかりません');
	}

	if (post.category !== params.category){
		throw error(404, 'error_test')
	}
	
	// ビルド後にcontentが空の場合は、ファイルシステムから直接読み込む
	if (!post.content) {
		try {
			const postsDir = join(process.cwd(), 'src', 'posts');
			const filePath = join(postsDir, `${params.slug}.md`);
			
			const fileContent = readFileSync(filePath, 'utf-8');
			const parsed = fm<FrontMatter>(fileContent);
			post.content = parsed.body;
		} catch (err) {
			console.error(`Failed to read markdown file for slug: ${params.slug}`, err);
			post.content = '';
		}
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