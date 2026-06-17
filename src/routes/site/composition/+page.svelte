<script>
	const { data } = $props();

	let pageTitle = '構成';
</script>

<svelte:head>
	<title>{pageTitle} | {data.site_title}</title>
	<meta property="og:title" content="{pageTitle} | {data.site_title}" />
</svelte:head>

<div class="mb-6">
	<p class="mb-4 text-xl">
		<i class="fa-solid fa-circle-info"></i>
		{pageTitle}
	</p>
</div>

<div class="mt-4">
	<p>準備中です。</p>
</div>
