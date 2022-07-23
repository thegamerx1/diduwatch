<script lang="ts">
	import { UserData } from '$lib/login_store';

	const user = (name: any) => `https://anilist.co/user/${name}`;
</script>

<div class="h-screen flex flex-col">
	<div class="navbar bg-base-100 px-5">
		<div class="flex-1">
			<a class="btn btn-ghost normal-case text-xl" href="/">DUW</a>
		</div>
		<div class="flex-none">
			<!-- <ul class="menu menu-horizontal p-0">
			<li tabindex="0">
				<a>
					Parent
					<svg
						class="fill-current"
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg
					>
				</a>
				<ul class="p-2 bg-base-100">
					<li><a>Submenu 1</a></li>
					<li><a>Submenu 2</a></li>
				</ul>
			</li>
		</ul> -->
			<div class="dropdown dropdown-end">
				<button class="avatar rounded-xl btn btn-circle">
					<div class="w-10 rounded-full">
						<img src={$UserData.user?.avatar} alt="Avatar" />
					</div>
				</button>
				<ul
					tabindex="0"
					class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
				>
					<li><a href={user($UserData.user?.name)}>{$UserData.user?.name}</a></li>
					<li><a href="/logout">Logout</a></li>
				</ul>
			</div>
		</div>
	</div>

	<slot />
</div>
