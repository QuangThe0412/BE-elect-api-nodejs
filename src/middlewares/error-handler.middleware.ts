import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';

function errorHandlerMiddleware(
    err: HttpError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(err);
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ mess: 'Bad Request Middleware' });
    }

    if (err.status === 401) {
        return res.status(401).json({ mess: 'Unauthorized Middleware' });
    }

    if (err.status === 403) {
        return res.status(403).json({ mess: 'Forbidden Middleware' });
    }

    if (err.status === 404) {
        return res.status(404).json({ mess: 'Not Found Middleware' });
    }

    if (err.status === 409) {
        return res.status(409).json({ mess: 'Conflict Middleware' });
    }

    if (err.status === 422) {
        return res.status(422).json({ mess: 'Unprocessable Entity Middleware' });
    }

    return res.status(500).json({ mess: 'Internal Server Error Middleware' });
}

export default errorHandlerMiddleware;