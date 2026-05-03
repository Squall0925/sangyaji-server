import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Public } from '../../common/decorators/public.decorator'

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('wx-login')
  async wxMiniLogin(@Body('code') code: string) {
    return this.authService.wxMiniLogin(code)
  }

  @Post('phone-login')
  async phoneLogin(
    @Body('phone') phone: string,
    @Body('code') code: string,
  ) {
    return this.authService.phoneLogin(phone, code)
  }

  @Post('send-code')
  async sendSmsCode(@Body('phone') phone: string) {
    // TODO: 对接短信服务
    return { success: true, message: '验证码已发送（开发模式：123456）' }
  }
}
