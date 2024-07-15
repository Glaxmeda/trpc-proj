import express from 'express'

import * as accounts from './routes/accounts-routes';
import { connectToCluster } from './mongodb-init-helpers';

startServer().catch((e) => {
    console.log(e);
    process.exit(1);
});

async function startServer() {
    const collections = await connectToCluster();

    // TODO: add body parser so that the application can parse the body of requests
    // ie so that you can do something like : req.body.VARIABLE_NAME

    const app = express();
    const PORT = 8080;

    app.get('/', async (_req: express.Request, res: express.Response) => {
        res.send('Hello world!');
    });

    // Route creators
    accounts.createRoutes(app, collections.account);
    
    app.listen(PORT, () => {
        console.log(`We are listening on port ${PORT}!`);
    });
}