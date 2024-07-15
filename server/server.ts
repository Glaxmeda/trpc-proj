import express from 'express'

startServer();

function startServer() {
    const app = express();
    const PORT = 8080;

    app.get('/', (_req: express.Request, res: express.Response) => {
        res.send('Hello world!');
    });
    
    app.listen(PORT, () => {
        console.log(`We are listening on port ${PORT}!`);
    });
}