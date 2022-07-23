import { writable } from 'svelte/store';
const OauthURL = (x: string) =>
	`https://anilist.co/api/v2/oauth/authorize?client_id=${x}&response_type=token`;

interface UserLogin {
	userid: number;
	token: string;
	valid: boolean;
}

interface UserData {
	list: AnimeEntry[];
	favourites: number[];
	user?: {
		name: string;
		avatar: string;
		id: number;
	};
}

export const UserData = writable<UserData>({
	list: [],
	favourites: []
});

export const JWT = writable<UserLogin>({
	userid: NaN,
	token: '',
	valid: false
});

export const login_url = OauthURL(import.meta.env.VITE_CLIENT_ID);
