import express from 'express';
import * as mongodb from 'mongodb';
import { Account } from './types';

export function createRoutes(app: express.Express, accountsCollection: mongodb.Collection<Account>) {
    app.post('/signin', async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        if(typeof username != 'string' && username.length < 4) {
            throw new Error();
        }

        if(typeof password != 'string' && password.length < 4) {
            throw new Error();
        }

        const passwordHash = password + 'my_hash';

        await accountsCollection.insertOne({ username, passwordHash });

        res.send({ success: true });
    });
}