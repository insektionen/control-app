import {MongoClient} from 'mongodb';
import {CollectionConnection} from '../types/types';

const { NODE_ENV, DB_USERNAME, DB_PASSWORD, DB_CLUSTER, DB_DATABASE, DB_OPTIONS } = process.env

const URL = NODE_ENV == 'development' ? 
        `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_DATABASE}?retryWrites=true&w=majority&${DB_OPTIONS}` :
        `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_DATABASE}?retryWrites=true&w=majority`;

// @ts-ignore
let cached = global.mongodb; // Handle cached connection
if (!cached) {
    // @ts-ignore
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
                collection: client.db(DB_DATABASE)
                    .collection(collection),
            }));
    }
    cached.conn = await cached.promise; // wait for promise to resolve
    return cached.conn; // return client and collection
}
