import * as mongodb from 'mongodb';
import { Account } from './models/accounts/accounts-types';

export async function connectToCluster() {
    const uri = 'mongodb://127.0.0.1/local-db-name';

    const connectionOptions: mongodb.MongoClientOptions = {
        writeConcern: { w: 1 },
        readConcern: { level: 'available' }
    };

    try {
        console.log('Connecting to MongoDB Atlas cluster...');
        const db = (await mongodb.MongoClient.connect(uri, connectionOptions)).db();
        console.log('Successfully connected to MongoDB Atlas!');
 
        return getCollections(db);
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        throw error;
    }
 }

 function getCollections(db: mongodb.Db) {
    return {
        account: db.collection<Account>('accounts')
    }
}

export const ZERO_OBJECTID = new mongodb.ObjectId('000000000000000000000000');