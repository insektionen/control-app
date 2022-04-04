import { Collection, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { BuildPile, Pile } from '../../types/types';
import { connectToCollection } from '../../util/db';
const { customAlphabet } = require('nanoid');
const alphabet =
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
const nanoid = customAlphabet(alphabet, 10);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Pile | string>
) {
	const { method, body, query } = req;
	switch (method) {
		case 'GET': {
			const { collection } = await connectToCollection();
			const pile = await collection.findOne<Pile>({ _id: query.id });
			res.status(200).json(pile!);
			break;
		}
		
		case 'DELETE': {
			const { collection } = await connectToCollection();
			collection.findOneAndDelete({ _id: query.id });
		}
	}
}

export async function getPile(id: string) {
	const { collection } = await connectToCollection();
	return await collection.findOne<Pile>({ _id: id });
}
