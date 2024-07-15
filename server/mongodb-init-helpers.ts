import * as mongodb from 'mongodb';
import { Account } from './models/accounts/types';

export async function connectToCluster() {
    const uri = 'mongodb://127.0.0.1/local-db-name';
    try {
        const mongoClient = new mongodb.MongoClient(uri);
        console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');
 
        return getCollections(mongoClient.db());
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
 }

 function getCollections(db: mongodb.Db) {
    return {
        account: db.collection<Account>('accounts')
    }
}