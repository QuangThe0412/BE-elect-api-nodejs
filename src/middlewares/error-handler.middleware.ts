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
        return res.status(400).json({ message: 'Bad Request' });
    }

    if (err.status === 401) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (err.status === 403) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    if (err.status === 404) {
        return res.status(404).json({ message: 'Not Found' });
    }

    if (err.status === 409) {
        return res.status(409).json({ message: 'Conflict' });
    }

    if (err.status === 422) {
        return res.status(422).json({ message: 'Unprocessable Entity' });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
}

export default errorHandlerMiddleware;