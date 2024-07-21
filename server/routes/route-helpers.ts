import express from 'express';

export class ExpectedError extends Error {
    public status: number;

    constructor({ status, message }: { status: number, message: string }) {
        super(message);
        this.status = status;
    }
}

export function asyncRoute(fn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<express.Response>): express.Handler {
    const expressHandler: express.Handler = (req, res, next) => {
        // Handle errors using the error middleware in server.ts.
        fn(req, res, next).catch(e => next(e));
    }
    
    return expressHandler;
}