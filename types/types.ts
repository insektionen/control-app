import { Collection, MongoClient, ObjectId } from 'mongodb';

export interface CollectionConnection {
  client: MongoClient;
  collection: Collection;
}

export type Action = {
  title: string;
  topic: string;
  msg: string | string[];
};

export type Pile = {
  _id: string;
  name: string;
  actions: Action[];
};

export type BuildPile = Omit<Pile, '_id'>;
