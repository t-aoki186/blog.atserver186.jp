<script lang="ts">
	import type { Post } from '$lib/types';
	import PostCard from '$lib/components/PostCard.svelte';

	// Svelte 5 の $props() で data を受け取る
	const { data } = $props();

	import { onMount } from 'svelte';
	import { reveal } from '$lib/reveal';

	// data.posts を使う（+page.server.ts から渡される）
	const posts = $derived(data.posts);

	let pageTitle = 'ホーム';
</script>

<svelte:head>
	<title>{pageTitle} | {data.site_title}</title>
	<meta property="og:title" content="{pageTitle} | {data.site_title}" />
</svelte:head>

<main class="mt-15 mr-1 ml-1 min-h-screen">
	<section class="container mx-auto mt-20 mb-25">
		<div class="post-list-content">
			<div class="mr-8p-4">
				<PostCard {posts} />
			</div>
			<aside class="aside-content" style="border-left: 1px solid #000;">
				<div class="ml-8 w-full">
					<form action="#" class="flex w-full items-center overflow-hidden py-4">
						<label class="flex-1">
							<input type="text" class="sf-input h-11.25 w-full border-none" placeholder="キーワードを入力" />
						</label>
						<button type="submit" class="sf-submit h-11.25 w-12.5 cursor-pointer" aria-label="検索"></button>
					</form>
					<hr class="main-hr" style="margin-bottom: 1rem !important;"/>
                    <p class="border-l-3 border-gray-500 pl-2 text-xl">最近の投稿</p>
				</div>
			</aside>
		</div>
	</section>
</main>

<ol class="main-breadcrumb container mx-auto">
	<li><a href="/">ホーム</a></li>
	<li>{pageTitle}</li>
</ol>

<style>
	.sf-input {
		box-sizing: border-box;
		background-color: #f2f2f2;
		font-size: 1em;
		outline: none;
	}

	.sf-input::placeholder {
		color: #777777;
	}

	.sf-submit {
		display: flex;
		justify-content: center;
		align-items: center;
		border: none;
		border-radius: 0 3px 3px 0;
		background-color: #5e5e5e;
	}

	.sf-submit::after {
		width: 24px;
		height: 24px;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z' fill='%23fff'%3E%3C/path%3E%3C/svg%3E");
		background-repeat: no-repeat;
		content: '';
	}
</style>
