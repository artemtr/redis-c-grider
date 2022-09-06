import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usersKey } from '$services/keys';
import { userNameUniqueKey, userNamesKey } from '$services/keys';
export const getUserByUsername = async (username: string) => {
	const id = await client.zScore(userNamesKey(), username);
	if (!id) {
		throw new Error('doesnt exist');
	}
	const hexId = id.toString(16);

	const user = await client.hGetAll(usersKey(hexId));
	return deserialize(hexId, user);
};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id));

	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId();
	// if user already in set
	const checkUser = await client.sIsMember(userNameUniqueKey(), attrs.username);
	if (checkUser) {
		throw new Error('user is taken');
	}
	await client.hSet(usersKey(id), serialize(attrs));
	await client.sAdd(userNameUniqueKey(), attrs.username);
	await client.zAdd(userNamesKey(), {
		value: attrs.username,
		score: parseInt(id, 16)
	});
	return id;
};

const serialize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	};
};

const deserialize = (id: string, user: { [key: string]: string }) => {
	return {
		id,
		username: user.username,
		password: user.password
	};
};
