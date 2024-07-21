import express from 'express'
import bodyParser from 'body-parser';
import * as accounts from './routes/accounts-routes';
import { connectToCluster } from './mongodb-init-helpers';
import { ExpectedError } from './routes/route-helpers';

startServer().catch((e) => {
    console.log(e);
    process.exit(1);
});

async function startServer() {
    const collections = await connectToCluster();

    const app = express();
    const PORT = 8080;

    // Middleware
    // Set a limit to the amount of json that the application handles so that we are not susceptible to attacks
    // involving overloading a server by sending it large json files to parse.
    app.use(bodyParser.json({ limit: '16mb' }));

    // Allows for a json-like experience even with url-encoded data
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/', async (_req: express.Request, res: express.Response) => {
        res.send('Hello world!');
    });

    // Route creators
    accounts.createRoutes(app, collections.account);


    // Error handling middleware
    app.use(errorHandler);
    
    app.listen(PORT, () => {
        console.log(`We are listening on port ${PORT}!`);
    });
}

function errorHandler(err: unknown, _req: express.Request, res: express.Response, _: express.NextFunction) {
    let message;
    let status = 500;
    if(err instanceof ExpectedError) {
        if(err.status >= 500) {
            console.error(err.message);
        }
        message = err.message;
        status = err.status;
    }  else if(err instanceof Error && err.message.length > 0) {
        message = err.message;
    } else {
        message = 'Unknown error';
    }

    res.status(status);
    return res.send(message);
}