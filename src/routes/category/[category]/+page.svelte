<script lang="ts">
	import type { Post } from '$lib/types';
    import PostCard from '$lib/components/PostCard.svelte';

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
			<PostCard posts={posts} />
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
