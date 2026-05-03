import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/** 从 request 中获取当前登录用户ID（由 JwtAuthGuard 注入） */
export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.userId
  },
)
