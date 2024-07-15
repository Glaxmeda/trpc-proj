import * as mongodb from 'mongodb';
import { Account } from './accounts-types';

export class AccountModel {
    private static singletonClass: AccountModel | undefined = undefined;

    constructor(private accountsCollection: mongodb.Collection<Account> ) {}

    static singleton(collection: mongodb.Collection<Account>) {
        if(!this.singletonClass) {
            this.singletonClass = new AccountModel(collection);
        }
        
        return this.singletonClass;
    }

    public createNewAccount({ username, password }: { username: string, password: string }) {
        // TODO: better hash
        const passwordHash = password + 'my_hash';
        return this.accountsCollection.insertOne({ username, passwordHash });
    }    
}