import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = '服务器内部错误'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>
        // class-validator 返回数组格式的 message
        if (Array.isArray(resp.message)) {
          message = resp.message.join('; ')
        } else if (typeof resp.message === 'string') {
          message = resp.message
        } else {
          message = exception.message
        }
      }
    } else {
      this.logger.error('未处理异常:', exception)
    }

    response.status(status).json({
      code: status,
      data: null,
      message,
    })
  }
}
