import { client } from '$services/redis';
import { itemsByViewsKey, itemsKey, itemsViewsKey } from '../keys';

export const incrementView = async (itemId: string, userId: string) => {
	return client.incrementView(itemId, userId);
};
