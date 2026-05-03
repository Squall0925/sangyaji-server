import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../common/prisma.service'

export interface WxLoginResult {
  openid: string
  unionid?: string
  session_key: string
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  /** 微信小程序登录 */
  async wxMiniLogin(code: string) {
    const wxResult = await this.code2Session(code)
    let user = await this.prisma.user.findUnique({
      where: { wechatOpenid: wxResult.openid },
    })

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          wechatOpenid: wxResult.openid,
          wechatUnionid: wxResult.unionid,
          nickname: '蚕友',
        },
      })
    }

    const token = this.generateToken(user.id)
    return { token, user }
  }

  /** 手机号登录 */
  async phoneLogin(phone: string, code: string) {
    // TODO: 验证短信验证码
    let user = await this.prisma.user.findUnique({ where: { phone } })

    if (!user) {
      user = await this.prisma.user.create({
        data: { phone, nickname: '蚕友' },
      })
    }

    const token = this.generateToken(user.id)
    return { token, user }
  }

  /** 生成JWT Token */
  private generateToken(userId: string): string {
    return this.jwt.sign({ sub: userId })
  }

  /** 微信code换session */
  private async code2Session(code: string): Promise<WxLoginResult> {
    const appid = this.config.get('WECHAT_APPID')
    const secret = this.config.get('WECHAT_SECRET')

    // TODO: 正式环境调用微信API
    // const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
    // const res = await fetch(url)

    // 开发环境返回模拟数据
    return {
      openid: `dev_openid_${code}`,
      session_key: 'dev_session_key',
    }
  }
}
