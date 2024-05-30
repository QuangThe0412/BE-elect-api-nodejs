import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';

const validate =
    (schema: Yup.AnySchema) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateSync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (err: any) {
            return res
                .status(500)
                .json({ type: err.name, mess: err.message });
        }
    };

export default validate;
