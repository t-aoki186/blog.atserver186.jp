<script lang="ts">
	import type { Post } from '$lib/types';

	// Svelte 5 の $props() で data を受け取る
	const { data } = $props();

	import { onMount } from 'svelte';
	import { reveal } from '$lib/reveal';

	// data.posts を使う（+page.server.ts から渡される）
	const posts = $derived(data.posts);

	let pageTitle = '記事一覧';
</script>

<svelte:head>
	<title>{pageTitle} | {data.site_title}</title>
	<meta property="og:title" content="{pageTitle} | {data.site_title}" />
</svelte:head>

<main class="mt-15 mr-1 ml-1 min-h-screen">
	<div class="container m-auto mt-25 border-b-2 border-b-(--main-text-color)">
		<p
			class="tf26-page-title"
			style="color: black; margin-bottom: 0; view-transition-name: tfvisitortitle-hero;"
		>
			{pageTitle}
		</p>
	</div>
	<section class="container mx-auto mt-15 mb-25">
		<div class="post-list-content">
			<div class="post-list-grid-item mr-8">
				{#each posts as post}
					<a href={`/article/${post.category}/${post.slug}`}>
						<article
							class="article-card mb-4 flex gap-5 rounded-t-xs border-b-2 border-b-(--main-text-color) p-4"
						>
							<img src={post.thumbnail} alt="{post.title}のサムネイル" class="w-30 rounded-lg" />
							<div class="flex-1">
								<h2 class="mb-2 text-2xl">{post.title}</h2>
								<div class="flex">
									<p>{post.heading}</p>
									<div
										class="ml-auto w-fit rounded-2xl border border-gray-500 px-2 py-1 text-right"
									>
										<p class="text-xs">{post.author}</p>
									</div>
								</div>
							</div>
						</article>
					</a>
				{/each}
			</div>
			<aside style="border-left: 1px solid #000;">
				<div class="ml-8"><p>test</p></div>
			</aside>
		</div>
	</section>
</main>

<ol class="main-breadcrumb container mx-auto">
	<li><a href="/">ホーム</a></li>
	<li>{pageTitle}</li>
</ol>

<style>
	.post-list-content {
		display: grid;
		grid-template-columns: 2fr 1fr; /*左:右 = 4:3*/
	}

	@media (max-width: 768px) {
		.post-list-content {
			grid-template-columns: 1fr; /*縦並び*/
		}
	}

	.article-card {
		transition: 0.2s;
	}

	.article-card:hover {
		background-color: var(--color-gray-300);
	}
</style>
