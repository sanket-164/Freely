import { NextFunction, Request, Response } from "express";
import IndexUtil from "./index.util";

class IndexMiddleware {
    static async validateRequest(req: Request, res: Response, next: Function) {

        const validators = IndexUtil.getEndpointValidator(req.path);

        const errors = validators ? await Promise.all(validators.map(validation => validation.run(req))) : null;

        if (!errors || errors.every(error => error.isEmpty())) {
            next();
        } else {
            const errorDetails = errors ? errors.map(error => error.array()[0]).filter(error => error !== undefined) : [];
            res.status(400).json({ errors: errorDetails });
        }
    }

    static async errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
        res.status(500).json({ error: error.message });
    }
}

export default IndexMiddleware;