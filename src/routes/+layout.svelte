<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	/*ローディング*/
	import { isVisible, hasInitialized } from '$lib/stores/loader.js';
	import Loading from '$lib/components/Loading.svelte';
	/*独自スタイル*/
	import './layout.css';
	import './icon.css';
	import './components.css';
	/*favicon*/
	import favicon from '$lib/assets/favicon.png';
	import { get } from 'svelte/store';
	/*NProgress*/
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	//AOS(Animate On Scroll)
	import AOS from 'aos';
	import 'aos/dist/aos.css';
	/*Sveltekit-View-Transition(ページ遷移時のアニメーション)*/
	import { setupViewTransition } from 'sveltekit-view-transition';
	/*モーダル*/
	import Modal from '$lib/components/Modal.svelte';
	/*SEO*/
	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';

	/*s:NProgressの設定*/
	beforeNavigate(() => {
		NProgress.start();
	});

	afterNavigate(() => {
		NProgress.done();
		// ページ遷移時にメニューを閉じる
		open = false;
		otherOpen = false;
	});
	/*e:NProgressの設定*/

	//export
	let { data, children } = $props();
	let accordionOpen = $state(false);

	/*s:共通変数*/
	let logo = '/img/logo.webp';
	let logo_alt = 'ATSERVERロゴ';
	/*e:共通変数*/

	/*s:ハンバーガーメニュー*/
	let open = $state(false);
	let isOtherClosing = $state(false);
	let otherOpen = $state(false);
	let pendingOpen = false;
	/*e;ハンバーガーメニュー*/

	/*s:target="_blank"モーダル*/
	let targetUrl = $state('');
	let showLinkModal = $state(false);
	let skipExternalLinkConfirmation = $state(false);
	/*e:target="_blank"モーダル*/

	/*s:ヘッダーその他メニュー*/
	function closeOther(goBackToMenu: boolean = false) {
		if (goBackToMenu) pendingOpen = true;
		otherOpen = false;
	}
	/*e:ヘッダーその他メニュー*/

	/*s:スクロールでヘッダーサイズ変更*/
	let scrolled = $state(false);

	const headerClass = $derived(
		`fixed top-0 right-0 left-0 z-20 border border-black/10 bg-white backdrop-blur-md transition-all duration-500 overflow-hidden z-9998` +
			(scrolled ? ' scroll-nav' : '') +
			(otherOpen
				? ' max-h-[100vh] rounded-b-[1.0rem]'
				: open
					? ' max-h-[400px] rounded-b-[1.0rem]'
					: ' max-h-[70px]') //メニュー展開前のheaderの高さ
	);

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 100;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
	/*e:スクロールでヘッダーサイズ変更*/

	/*s:モーダル*/
	let showModal = $state(false);
	let modalType = $state('');

	function openModal(type: string) {
		showModal = true;
		modalType = type;
	}
	/*e:モーダル*/

	/*s:AOSの初期化*/
	onMount(() => {
		AOS.init({
			// オプション（任意）
			duration: 800, //アニメーションの時間（ミリ秒）
			once: false //何度でもアニメーションを発火させる
		});
	});
	/*e:AOSの初期化*/

	/*s:View Transition*/
	setupViewTransition();
	/*e:View Transition*/

	/*s:ローディングアニメーション*/
	onMount(() => {
		// localStorage をチェック
		const alreadySeen = localStorage.getItem('hasSeenIntro');

		if (!alreadySeen) {
			//初回アクセスの場合
			isVisible.set(true);

			//動画を視聴済みのフラグを追加
			localStorage.setItem('hasSeenIntro', 'true');

			//動画の長さに合わせて自動で消す（動画のendedイベントを使わない場合の保険）
			setTimeout(() => {
				isVisible.set(false);
			}, 2000);
		}
	});
	/*e:ローディングアニメーション*/

	onNavigate((navigation) => {
		// ブラウザが View Transitions API に対応していない場合は何もしない
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.atserver186.jp/libs/fontawesome/css/all.min.css" />
	<link rel="icon" href={favicon} />
	<!--s:SEO-->
	<!--各ページでheadに内容がなければ以下の内容が表示される-->
	<title>桐朋コンピューター部 | 桐朋祭2026</title>
	<meta
		name="description"
		content="桐朋中学・高等学校の学園祭「桐朋祭」の公式ホームページです。2026/06/06(土)-08(月)開催！"
	/>
	<meta name="keywords" content="桐朋,桐朋中学校,桐朋高校,桐朋中学高等学校,桐朋祭,学園祭,文化祭" />
	<meta property="og:site_name" content="第75回桐朋祭(桐朋祭2026)" />
	<meta property="og:type" content="website" />
	<!--<meta property="og:image" content="https://tohofes.jp/ogp.png" />-->
	<meta property="og:title" content="第75回桐朋祭(桐朋祭2026)" />
	<link rel="canonical" href={$page.url.href} />
	<meta property="og:url" content={$page.url.href} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@tohofes_2026" />
	<!--e:SEO-->
</svelte:head>

<Modal bind:showModal>
	{#if modalType === 'search'}
		<form class="s-search-form mb-4" action="/organizations/" method="GET">
			<input
				class="s-search-input"
				type="text"
				id="searchTerm"
				name="search"
				placeholder="検索..."
			/>
			<button class="m-search-button" type="submit" title="検索する"
				><i class="fas fa-search"></i></button
			>
		</form>
		<div class="relative m-auto mt-10 mb-4 max-w-125 bg-white">
			<!-- 左下の角 -->
			<span
				class="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-(--main-text-color)"
			></span>
			<!-- 右下の角 -->
			<span
				class="absolute right-0 bottom-0 h-4 w-4 border-r-2 border-b-2 border-(--main-text-color)"
			></span>
			<!-- コンテンツ -->
			<div class="flex justify-center gap-4 font-bold text-(--main-text-color)">
				<div class="tp-search-method">
					<a href="/organizations" class="dash-link">
						<i class="fa-solid fa-list"></i>
						<p>絞り込む</p>
					</a>
				</div>
				<div class="tp-search-method">
					<a href="/timetable" class="dash-link">
						<i class="fa-solid fa-list"></i>
						<p>タイムテーブルから<br />探す</p>
					</a>
				</div>
			</div>
		</div>
	{/if}
</Modal>


{#if $isVisible}
	<Loading />
{/if}

<header class={headerClass}>
	<div class="flex items-center justify-between px-2 py-2">
		<!--s:ロゴ-->
		<a href="/" class="flex shrink-0 whitespace-nowrap transition">
			<img src={logo} alt="" class="ml-2 h-13 w-auto rounded-xl" />
			<!--<p class="m-auto header-text">TOHO FES 2026</p>-->
		</a>
		<!--e:ロゴ-->
		<!---->
		<div class="flex items-center md:hidden">
			<!--s:スマホ用検索ボタン-->
			<button
				onclick={() => openModal('search')}
				type="button"
				title="検索する"
				class="mr-4 cursor-pointer text-sm"
				><i class="fa-solid fa-magnifying-glass text-(--main-text-color)"></i></button
			>
			<!--e:スマホ用検索ボタン-->
			<!-- ハンバーガー / その他メニュー閉じる（スマホ用） -->
			<div class="grid">
				{#if !otherOpen}
					<button
						class="col-start-1 row-start-1 flex cursor-pointer flex-col gap-1.5"
						transition:fade={{ duration: 300 }}
						onclick={() => (open = !open)}
						title="メニュー"
					>
						<div class="flex h-10 w-9 cursor-pointer flex-col items-center justify-center">
							<input class="peer hidden" type="checkbox" checked={open} />
							<div
								class="header-hamburger h-0.5 w-[50%] origin-left translate-y-[0.45rem] rounded-sm bg-black transition-all duration-300 peer-checked:-rotate-45"
							></div>
							<div
								class="header-hamburger h-0.5 w-[50%] origin-center rounded-md bg-black transition-all duration-300 peer-checked:hidden"
							></div>
							<div
								class="header-hamburger h-0.5 w-[50%] origin-left translate-y-[-0.45rem] rounded-md bg-black transition-all duration-300 peer-checked:rotate-45"
							></div>
						</div>
					</button>
				{/if}

				{#if otherOpen}
					<button
						class="col-start-1 row-start-1 flex cursor-pointer flex-col gap-1.5"
						transition:fade={{ duration: 300 }}
						onclick={() => closeOther(open)}
						title="メニュー"
					>
						<div class="flex h-10 w-9 cursor-pointer flex-col items-center justify-center">
							<i class="fa-solid fa-angle-left other-close-ico"></i>
						</div>
					</button>
				{/if}
			</div>
		</div>
		<!---->
		<!--PC用メニュー-->
		<nav class="hidden md:flex">
			<ul class="flex items-center gap-5 whitespace-nowrap transition">
				<li><a href="/" class="header-text ml-3 text-xs tracking-wider transition">ホーム</a></li>
				<li>
					<a href="/about" class="header-text ml-3 text-xs tracking-wider transition">TCCについて</a
					>
				</li>
				<li>
					<a href="/article" class="header-text ml-3 text-xs tracking-wider transition">記事</a>
				</li>
				<li>
					<a href="/exhibit" class="header-text ml-3 text-xs tracking-wider transition">展示物</a>
				</li>
				<li class="mr-6">
					<button
						class="header-text ml-3 cursor-pointer text-xs tracking-wider transition"
						onclick={() => (otherOpen = !otherOpen)}>その他</button
					>
				</li>
			</ul>
		</nav>
	</div>

	<!--スマホ用メニュー-->
	{#if !otherOpen && !isOtherClosing}
		<nav class="px-6 pt-6 pb-6 md:hidden">
			<ul class="flex flex-col gap-4 text-sm tracking-wide">
				<li><a href="/" class="header-text">ホーム</a></li>
				<li><a href="/about" class="header-text">桐朋祭とは</a></li>
				<li><a href="/visitor" class="header-text">来場者の皆様へ</a></li>
				<li><a href="/organizations" class="header-text">団体/飲食/企画/イベント</a></li>
				<li><a href="/timetable" class="header-text">タイムテーブル</a></li>
				<li>
					<button class="header-text" onclick={() => (otherOpen = !otherOpen)}>その他</button>
				</li>
			</ul>
		</nav>
	{/if}

	{#if otherOpen}
		<nav
			class="overflow-auto p-6"
			transition:fade={{ duration: 500 }}
			onoutrostart={() => (isOtherClosing = true)}
			onoutroend={() => {
				isOtherClosing = false;
				if (pendingOpen) {
					open = true;
					pendingOpen = false;
				}
			}}
		>
			<ul class="flex flex-col gap-4 text-sm tracking-wide">
				<li>
					<a href="/access" class="header-text"
						><i class="fa-solid fa-map mr-1 text-xs"></i>本校へのアクセス</a
					>
				</li>
				<li>
					<a href="/site/sitemap" class="header-text"
						><i class="fa-solid fa-sitemap mr-1 text-xs"></i>サイトマップ</a
					>
				</li>
				<li>
					<a href="/qa" class="header-text"
						><i class="fa-solid fa-circle-question mr-1 text-xs"></i>よくある質問</a
					>
				</li>
				<li>
					<a href="/link" class="header-text"
						><i class="fa-solid fa-arrow-up-right-from-square mr-1 text-xs"></i>SNSリンク</a
					>
				</li>
				<li>
					<a href="/news" class="header-text"
						><i class="fa-solid fa-arrow-up-right-from-square mr-1 text-xs"></i>お知らせ</a
					>
				</li>
				<li>
					<a href="/site/info" class="header-text"
						><i class="fa-solid fa-circle-info mr-1 text-xs"></i>情報</a
					>
				</li>
				<li>
					<a href="/site/oss" class="header-text"
						><i class="fa-solid fa-rectangle-list mr-1 text-xs"></i>使用しているOSS一覧</a
					>
				</li>
				<li>
					<a href="/site/saucecode" class="header-text"
						><i class="fa-solid fa-code mr-1 text-xs"></i>ソースコード</a
					>
				</li>
				<li>
					<a href="https://www.toho.ed.jp/" target="_blank" class="header-text"
						><i class="fa-solid fa-arrow-up-right-from-square mr-1 text-xs"
						></i>桐朋中学校・高等学校HP</a
					>
				</li>
				<li>
					<a href="https://2026.tcc-archive.club/" target="_blank" class="header-text"
						><i class="fa-solid fa-arrow-up-right-from-square mr-1 text-xs"
						></i>コンピューター部桐朋祭用特設HP</a
					>
				</li>
				<li>
					<a href="/site/contact" class="header-text"
						><i class="fa-solid fa-envelope mr-1 text-xs"></i>お問い合わせ</a
					>
				</li>
				<hr class="main-hr" />
				<button class="header-text" onclick={() => closeOther(open)}>
					<i class="fa-solid fa-angle-left mr-1 text-xs"></i>
					{#if open}メニューに戻る{/if}
					{#if !open}閉じる{/if}
				</button>
			</ul>
		</nav>
	{/if}
</header>

<!-- ページ内容 -->
{@render children()}

<!--フッター-->
<footer class="footer m-0 w-full">
	<div class="container">
		<!--s:PC表示用-->
		<div class="hidden md:flex">
			<div class="footer-top-content">
				<!-- フッターの左側コンテンツ -->
				<div class="footer-flex-content">
					<div class="footer-logo">
						<a href="/">
							<img src={logo} alt={logo_alt} class="h-auto w-45 rounded-xl" />
						</a>
					</div>
				</div>

				<!-- フッターの右側コンテンツ -->
				<div class="footer-flex-content">
					<h4>ご案内</h4>
					<ul>
						<li><a href="/about">桐朋祭について</a></li>
						<li><a href="/visitor">来場者の皆様へ</a></li>
						<li><a href="/access">本校へのアクセス</a></li>
						<li><a href="/timetable">タイムテーブル</a></li>
						<li><a href="/qa">よくある質問</a></li>
						<li><a href="/news">お知らせ</a></li>
						<li><a href="/site/info">サイト情報</a></li>
						<li><a href="/site/sitemap">サイトマップ</a></li>
						<li><a href="/site/contact">お問い合わせ</a></li>
					</ul>
				</div>
				<div class="footer-flex-content">
					<h4>参加団体</h4>
					<ul>
						<li><a href="/">ランダムに5件表示</a></li>
						<li><a href="/organizations">すべての参加団体を確認する</a></li>
					</ul>
				</div>
				<div class="footer-flex-content">
					<h4>各種SNS / リンク</h4>
					<ul>
						<li>
							<a href="https://x.com" target="_blank">
								<i class="fa-brands fa-x-twitter mr-1 text-xs"></i>
								<span>X(Twitter)</span>
							</a>
						</li>
						<li>
							<a href="https://www.instagram.com" target="_blank">
								<i class="fa-brands fa-instagram mr-1 text-xs"></i>
								<span>Instagram</span>
							</a>
						</li>
						<li>
							<a href="https://atserver186.jp" target="_blank">
								<i class="fa-solid fa-arrow-up-right-from-square mr-1 text-xs"></i>
								<span>ATSocial</span>
							</a>
						</li>
						<li>
							<a href="http://toho.ed.jp" target="_blank">
								<i class="fa-solid fa-arrow-up-right-from-square mr-1 text-xs"></i>
								<span>桐朋中学校・高等学校HP</span>
							</a>
						</li>
						<li>
							<a href="https://2026.tcc-archive.club" target="_blank">
								<i class="fa-solid fa-arrow-up-right-from-square mr-1 text-xs"></i>
								<span>コンピューター部桐朋祭用特設HP</span>
							</a>
						</li>
						<li>
							<a href="/link">
								<i class="fa-solid fa-arrow-up-right-from-square mr-1 text-xs"></i>
								<span>すべてのリンクを確認する</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<!--e:PC表示用-->
		<!---->
		<!--s:モバイル表示用-->
		<div class="flex w-full flex-col p-1 md:hidden">
			<!--s:ロゴ・住所-->
			<div class="flex flex-col items-center justify-center gap-4">
				<a href="/">
					<img src={logo} alt={logo_alt} class="mt-4 h-auto w-35 rounded-xl" />
				</a>
			</div>
			<!--s:ロゴ・住所-->
			<!---->
			<!--s:アコーディオン-->
			<div class="mt-8">
				<details class="accordion-main mb-4 min-w-full">
					<summary class="font-bold">ご案内</summary>
					<ul class="pt-2 pl-2">
						<li><a href="/about">桐朋祭について</a></li>
						<li><a href="/visitor">来場者の皆様へ</a></li>
						<li><a href="/access">本校へのアクセス</a></li>
						<li><a href="/timetable">タイムテーブル</a></li>
						<li><a href="/qa">よくある質問</a></li>
						<li><a href="/news">お知らせ</a></li>
						<li><a href="/site/info">サイト情報</a></li>
						<li><a href="/site/sitemap">サイトマップ</a></li>
						<li><a href="/site/contact">お問い合わせ</a></li>
					</ul>
				</details>
				<details class="accordion-main mb-4 min-w-full">
					<summary class="font-bold">参加団体</summary>
					<ul class="pt-2 pl-2">
						<li><a href="/">ランダムに5件表示</a></li>
						<li><a href="/organizations">すべての参加団体を確認する</a></li>
					</ul>
				</details>
				<details class="accordion-main min-w-full">
					<summary class="font-bold">各種SNS / リンク</summary>
					<ul class="pt-2 pl-2">
						<li>
							<a href="https://x.com" target="_blank">
								<i class="fa-brands fa-x-twitter mr-1 text-xs"></i>
								<span>X(Twitter)</span>
							</a>
						</li>
						<li>
							<a href="https://www.instagram.com" target="_blank">
								<i class="fa-brands fa-instagram mr-1 text-xs"></i>
								<span>Instagram</span>
							</a>
						</li>
						<li>
							<a href="https://atserver186.jp" target="_blank">
								<i class="fa-solid fa-arrow-up-right-from-square mr-1 text-xs"></i>
								<span>ATSocial</span>
							</a>
						</li>
						<li>
							<a href="http://toho.ed.jp" target="_blank">
								<i class="fa-solid fa-arrow-up-right-from-square mr-1 text-xs"></i>
								<span>桐朋中学校・高等学校HP</span>
							</a>
						</li>
						<li>
							<a href="https://2026.tcc-archive.club" target="_blank">
								<i class="fa-solid fa-arrow-up-right-from-square mr-1 text-xs"></i>
								<span>コンピューター部桐朋祭用特設HP</span>
							</a>
						</li>
						<li>
							<a href="/link">
								<i class="fa-solid fa-arrow-up-right-from-square mr-1 text-xs"></i>
								<span>すべてのリンクを確認する</span>
							</a>
						</li>
					</ul>
				</details>
			</div>
			<!--e:アコーディオン-->
		</div>
		<!--e:モバイル表示用-->
		<!---->
		<!--s:フッター最下部-->
		<div class="footer-bottom-content mx-auto">
			<br />
			<hr class="sub-hr" />
			<br />
			<a href="/site/site-policy" class="footer-link" style="margin-right: 10px;">サイトポリシー</a
			><span class="footer-span">|</span>
			<a
				href="/site/privacy-policy"
				class="footer-link"
				style="margin-right: 10px; margin-left: 10px;">プライバシーポリシー</a
			><span class="footer-span">|</span>
			<a href="/site/contact" class="footer-link" style="margin-left: 10px;">お問い合わせ</a>
			<p class="footer-text">
				&copy; 2026 TohoFes. | tohofes.jp All Rights Reserved.
				本サイトの無断転載は、固くこれを禁じます。
			</p>
		</div>
		<!--e:フッター最下部-->
	</div>
</footer>

<style>
	.redirect-link-actions {
		display: flex;
		gap: 10px;
		justify-content: center;
	}

	@media (max-width: 768px) {
		.redirect-link-actions {
			flex-direction: column;
		}

		.link-main {
			width: 100%;
		}
	}
</style>
