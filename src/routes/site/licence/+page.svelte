<script lang="ts">
	const { data } = $props();

	let pageTitle = 'オープンソースライセンス';
</script>

<svelte:head>
	<title>{pageTitle} | {data.site_title}</title>
	<meta property="og:title" content="{pageTitle} | {data.site_title}" />
</svelte:head>

<div class="mb-6">
	<p class="mb-4 text-xl">
		<i class="fa-solid fa-gavel"></i>
		オープンソースライセンス
	</p>
</div>

<div class="mt-4">
	<p>生成日時: {data.generatedAt}</p>
	<ul>
		{#each data.modules as module}
			<li>{module.name}@{module.version} {module.license ? `(${module.license})` : ''}</li>
		{/each}
	</ul>
</div>
