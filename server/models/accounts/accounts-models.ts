import * as mongodb from 'mongodb';
import { Account } from './accounts-types';
import bcrypt from 'bcryptjs';
import { ExpectedError } from '@/server/routes/route-helpers';

export class AccountModel {
    private static singletonClass: AccountModel | undefined = undefined;

    constructor(private accountsCollection: mongodb.Collection<Account> ) {}

    static singleton(collection: mongodb.Collection<Account>) {
        if(!this.singletonClass) {
            this.singletonClass = new AccountModel(collection);
        }
        
        return this.singletonClass;
    }

    public async createNewAccount({ username, password }: { username: string, password: string }) : Promise<Account> {
        const account = await this.accountsCollection.findOne({username: username});
        
        //if account exists 
        if(account) {
           if (await bcrypt.compare(password + account.salt, account.passwordHash)){
            return account;
           }
           else  {
            throw new ExpectedError({status: 500, message: "Password incorrect"});
           }  
        }
        
        //If account does not exist
        else{
            // Get salt and hash for password encryption 
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password + salt, 1);
    
            // const passwordHash = password + 'my_hash';
            await this.accountsCollection.insertOne({username, passwordHash, salt});
            
            return {username, passwordHash, salt};

        }
    }    
}