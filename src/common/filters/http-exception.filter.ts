import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const req = context.getRequest<Request>()
    const res = context.getResponse<Response>()

    const statusCode = exception instanceof HttpException
      ? (exception as HttpException).getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const message = exception instanceof HttpException
      ? (exception as HttpException).message : 'Ocorreu um erro desconhecido ao processar a sua solicitação'

    this.logger.error(`[Error] Http status code: ${statusCode} - Message: ${message} - ${new Date().toISOString()}`)

    return res.status(statusCode).json({
      timestamp: new Date().getTime(),
      path: req.url,
      message,
    })
  }
}