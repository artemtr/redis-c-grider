import { userNameUniqueKey } from '$services/keys';
import { client } from '$services/redis';
import { userLikesKey, itemsKey } from '../keys';
import { getItems } from './items';
export const userLikesItem = async (itemId: string, userId: string) => {
	return client.sIsMember(userLikesKey(userId), itemId);
};

export const likedItems = async (userId: string) => {
	// Fetch all the item ids from this users liked set
	const ids = await client.sMembers(userLikesKey(userId));
	// Fetch all items
	return getItems(ids);
};

export const likeItem = async (itemId: string, userId: string) => {
	const inserted = await client.sAdd(userLikesKey(userId), itemId);
	if (inserted) {
		await client.hIncrBy(itemsKey(itemId), 'likes', 1);
	}
};

export const unlikeItem = async (itemId: string, userId: string) => {
	const removed = await client.sRem(userLikesKey(userId), itemId);
	if (removed) {
		await client.hIncrBy(itemsKey(itemId), 'likes', -1);
	}
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
	const ids = await client.sInter([userLikesKey(userOneId), userLikesKey(userTwoId)]);
	return getItems(ids);
};
