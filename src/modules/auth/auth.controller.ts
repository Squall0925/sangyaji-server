import { Controller, Post, Body, BadRequestException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SmsService } from './sms.service'
import { Public } from '../../common/decorators/public.decorator'
import { SendCodeDto } from './dto/send-code.dto'
import { PhoneLoginDto } from './dto/phone-login.dto'
import { WxLoginDto } from './dto/wx-login.dto'

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private smsService: SmsService,
  ) {}

  @Post('wx-login')
  async wxMiniLogin(@Body() dto: WxLoginDto) {
    return this.authService.wxMiniLogin(dto.code)
  }

  @Post('phone-login')
  async phoneLogin(@Body() dto: PhoneLoginDto) {
    if (!this.smsService.verifyCode(dto.phone, dto.code)) {
      throw new BadRequestException('验证码错误或已过期')
    }
    return this.authService.phoneLogin(dto.phone, dto.code)
  }

  @Post('send-code')
  async sendSmsCode(@Body() dto: SendCodeDto) {
    await this.smsService.sendCode(dto.phone)
    return { success: true }
  }
}
