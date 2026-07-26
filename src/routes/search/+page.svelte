<script lang="ts">
	import type { Post } from '$lib/types';
	import PostCard from '$lib/components/PostCard.svelte';

	// Svelte 5 の $props() で data を受け取る
	const { data } = $props();

	// data.posts をそのまま使う（+page.server.ts から渡される）
	const posts = $derived(data.posts);
	const q = $derived(data.q);

	const getPageTitle = (q: string): string => {
		return q ? `検索: ${q}` : '検索';
	};
	let pageTitle = $derived(getPageTitle(q));
</script>

<svelte:head>
	<title>{pageTitle} | {data.site_title}</title>
	<meta property="og:title" content="{pageTitle} | {data.site_title}" />
</svelte:head>

<div class="mb-6">
	<p class="mb-4 text-xl">
		<i class="fa-solid fa-magnifying-glass"></i>
		{pageTitle}
	</p>

	<form action="/search/" class="flex w-full items-center overflow-hidden py-4" method="GET">
		<label class="flex-1">
			<input
				type="text"
				name="q"
				class="sf-input h-11.25 w-full border-none"
				placeholder="キーワードを入力"
			/>
		</label>
		<button type="submit" class="sf-submit h-11.25 w-12.5 cursor-pointer" aria-label="検索"
		></button>
	</form>

	{#if q}
		<p class="mb-2">検索ワード: "{q}"</p>
		{#if posts.length > 0}
			<p class="mb-4">{posts.length} 件の結果が見つかりました。</p>
			<PostCard {posts} />
		{:else}
			<p>検索結果が見つかりませんでした。</p>
		{/if}
	{:else}
		<p>検索ワードを指定してください</p>
	{/if}
</div>
