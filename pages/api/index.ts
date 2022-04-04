import { Collection, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { BuildPile, Pile } from '../../types/types';
import { connectToCollection } from '../../util/db';
const { customAlphabet } = require('nanoid');
const alphabet =
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz?_';
const nanoid = customAlphabet(alphabet, 10);

function isValidPile(body: any): body is BuildPile {
	return (
		typeof body === 'object' &&
		typeof (body as BuildPile).name === 'string' &&
		Array.isArray((body as BuildPile).actions) &&
		!(body as BuildPile).actions.some(
			(a) =>
				typeof a.msg !== 'string' ||
				typeof a.title !== 'string' ||
				typeof a.topic !== 'string'
		)
	);
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Pile[] | Pile | string>
) {
	const { method, body } = req;

	switch (method) {
		case 'GET': {
			const r = await getPiles();
			res.status(200).json(r);
			break;
		}

		case 'POST': {
			if (!isValidPile(body)) {
				res.status(400).send('Body data is INcomplete');
			}
			const { collection } = await connectToCollection();
			const id = nanoid();
			const r = await collection.insertOne({
				name: body.name,
				actions: body.actions,
				_id: id,
			});
			res.status(200).json({ ...(body as BuildPile), _id: id });
			break;
		}
	}
}

export async function getPiles() {
	const { collection } = await connectToCollection();
	return await collection.find<Pile>({}).toArray();
}
