import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);
    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }
    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        if (exception instanceof HttpException) {
            httpStatus = exception.getStatus();
            message = exception.message;
            if (httpStatus >= 500) {
                this.logger.error(exception.stack);
            }
        } else {
            this.logger.error(exception);
        }
        httpAdapter.reply(
            response,
            {
                success: false,
                message,
            },
            httpStatus,
        );
    }
}