import {MongoClient} from 'mongodb';
import getConfig from 'next/config';
import {CollectionConnection} from '../types/types';

const {serverRuntimeConfig} = getConfig();
const URL = `mongodb+srv://${serverRuntimeConfig.db.username}:${serverRuntimeConfig.db.password}@${serverRuntimeConfig.db.cluster}/${serverRuntimeConfig.db.database}?retryWrites=true&w=majority`;

// @ts-ignore
let cached = global.mongodb; // Handle cached connection
// @ts-ignore
if (!cached) {
    cached = global.mongodb = {
        conn: null,
        promise: null
    };
} // If nothing is cached create object

export async function connectToCollection(): Promise<CollectionConnection> {
    const collection = 'piles';

    if (cached.conn) return cached.conn; // return the cached connection

    if (!cached.promise) {
        // create the connection promise
        cached.promise = MongoClient.connect(URL)
            .then((client) => ({
                client,
                collection: client.db(serverRuntimeConfig.db.database)
                    .collection(collection),
            }));
    }
    cached.conn = await cached.promise; // wait for promise to resolve
    return cached.conn; // return client and collection
}
