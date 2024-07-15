import express from 'express';
import * as mongodb from 'mongodb';
import { Account } from '../models/accounts/accounts-types';
import { AccountModel } from '../models/accounts/accounts-models';

export function createRoutes(app: express.Express, accountsCollection: mongodb.Collection<Account>) {
    app.post('/signin', async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        
        if(typeof username != 'string' || username.length < 4) {
            throw new Error();
        }

        if(typeof password != 'string' || password.length < 4) {
            throw new Error();
        }

        await AccountModel.singleton(accountsCollection).createNewAccount({ username, password });
        
        res.send({ success: true });
    });
}