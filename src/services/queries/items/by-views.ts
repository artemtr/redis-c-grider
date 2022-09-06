import { itemsByViewsKey, itemsKey } from '$services/keys';
import { client } from '$services/redis';
import { deserialize } from './deserialize';
export const itemsByViews = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	let results: any = await client.sort(itemsByViewsKey(), {
		GET: [
			'#',
			`${itemsKey('*')}->endingAt`,
			`${itemsKey('*')}->imageUrl`,
			`${itemsKey('*')}->price`,
			`${itemsKey('*')}->name`,
			`${itemsKey('*')}->views`
		],
		BY: 'nosort',
		DIRECTION: order,
		LIMIT: {
			offset,
			count
		}
	});

	const items = [];
	while (results.lenght) {
		const [id, name, views, endingAt, price, imageUrl, ...rest] = results;
		const item = deserialize(id, { name, views, endingAt, price, imageUrl });
		items.push(item);
		results = rest;
	}
	return items;
};
