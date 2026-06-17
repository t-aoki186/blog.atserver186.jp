<script>
	const { data } = $props();

	let pageTitle = 'ソースコード';
</script>

<svelte:head>
	<title>{pageTitle} | {data.site_title}</title>
	<meta property="og:title" content="{pageTitle} | {data.site_title}" />
</svelte:head>

<div class="mb-6">
	<p class="mb-4 text-xl">
		<i class="fa-solid fa-code"></i>
		{pageTitle}
	</p>
</div>

<div class="mt-4">
	<a href="https://github.com/t-aoki186/blog.atserver186.jp" target="_blank">
        <i class="fa-brands fa-github mr-1"></i>Githab</a>
</div>
