import { Collection, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { BuildPile, Pile } from '../../types/types';
import { connectToCollection } from '../../util/db';
const { customAlphabet } = require('nanoid');

function isValidPile(body: any): body is BuildPile {
  return (
    typeof body === 'object' &&
    typeof (body as BuildPile).name === 'string' &&
    (body as BuildPile).name.length > 1 &&
    Array.isArray((body as BuildPile).actions) &&
    !(body as BuildPile).actions.some(
      (a) => typeof a.msg !== 'string' || typeof a.title !== 'string' || typeof a.topic !== 'string'
    )
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Pile | string>) {
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
      res.status(200).send('Successfully deleted event!');
      break;
    }

    case 'PUT': {
      if (!isValidPile(body)) {
        res.status(400).send('Body data is INcomplete');
        break;
      }
      const { collection } = await connectToCollection();
      collection.findOneAndUpdate(
        { _id: query.id },
        {
          $set: {
            name: body.name,
            actions: body.actions,
          },
        }
      );
      const pile: Pile = {
        _id: query.id.toString(),
        name: body.name,
        actions: body.actions,
      };
      res.status(200).json(pile);
      break;
    }
  }
}

export async function getPile(id: string) {
  const { collection } = await connectToCollection();
  return await collection.findOne<Pile>({ _id: id });
}

export async function deletePile(id: string) {
  const { collection } = await connectToCollection();
  return await collection.findOneAndDelete({ _id: id });
}
