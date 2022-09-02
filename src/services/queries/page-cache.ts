import { client } from '$services/redis';
const cachedRoutes = ['./about', '/privacy', '/auth/signin', '/auth/signup'];

function pageKey(route: string): string {
	return 'pagecache#' + route;
}
export const getCachedPage = (route: string) => {
	if (cachedRoutes.includes(route)) {
		return client.get(pageKey(route));
	}
	return null;
};

export const setCachedPage = (route: string, page: string) => {
	if (cachedRoutes.includes(route)) {
		// ts-ignore
		client.set(pageKey(route), page, {
			EX: 2
		});
	}
};
