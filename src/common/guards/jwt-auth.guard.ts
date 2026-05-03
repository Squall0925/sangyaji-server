import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查是否标记为公开接口（如登录、注册）
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractToken(request)

    if (!token) {
      throw new UnauthorizedException('未提供认证令牌')
    }

    try {
      const payload = await this.jwtService.verifyAsync(token)
      // 将用户ID挂载到 request 上，供 @CurrentUserId() 使用
      ;(request as any).userId = payload.sub
    } catch {
      throw new UnauthorizedException('令牌无效或已过期')
    }

    return true
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization
    if (!authHeader) return null

    const [type, token] = authHeader.split(' ')
    if (type !== 'Bearer' || !token) return null

    return token
  }
}
