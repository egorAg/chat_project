import {Logger, NestMiddleware} from "@nestjs/common";
import { NextFunction, Request, Response } from 'express';

export class LoggingMiddleware implements NestMiddleware {
    logger: Logger = new Logger()

    use(req: Request, res: Response, next: NextFunction) {
        this.logger.log(`New incoming request: ${req.path}`)
        next()
    }
}