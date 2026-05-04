import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Dysmsapi from '@alicloud/dysmsapi20170525'
import * as OpenApi from '@alicloud/openapi-client'
import * as Util from '@alicloud/tea-util'

interface CodeEntry {
  code: string
  expiresAt: number
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name)
  private readonly codeStore = new Map<string, CodeEntry>()
  private readonly isDevMode: boolean
  private smsClient: Dysmsapi.default | null = null

  constructor(private config: ConfigService) {
    this.isDevMode = this.config.get('SMS_DEV_MODE', 'true') === 'true'

    if (!this.isDevMode) {
      const accessKeyId = this.config.get('SMS_ACCESS_KEY_ID')
      const accessKeySecret = this.config.get('SMS_ACCESS_KEY_SECRET')
      if (!accessKeyId || !accessKeySecret) {
        this.logger.error('阿里云短信配置缺失：SMS_ACCESS_KEY_ID / SMS_ACCESS_KEY_SECRET')
      } else {
        const openApiConfig = new OpenApi.Config({
          accessKeyId,
          accessKeySecret,
          endpoint: 'dysmsapi.aliyuncs.com',
        })
        this.smsClient = new Dysmsapi.default(openApiConfig)
      }
    }
  }

  /** 发送验证码 */
  async sendCode(phone: string): Promise<void> {
    // 检查发送频率（60秒内不能重复发送）
    const existing = this.codeStore.get(phone)
    if (existing && existing.expiresAt > Date.now() - 240000) {
      throw new BadRequestException('发送过于频繁，请稍后再试')
    }

    const code = this.generateCode()
    const expiresAt = Date.now() + 5 * 60 * 1000 // 5分钟有效

    this.codeStore.set(phone, { code, expiresAt })

    if (this.isDevMode) {
      this.logger.warn(`[DEV MODE] 手机号 ${phone} 的验证码: ${code}`)
      return
    }

    if (!this.smsClient) {
      this.logger.error('SMS 客户端未初始化，回退到开发模式')
      this.logger.warn(`[FALLBACK] 手机号 ${phone} 的验证码: ${code}`)
      return
    }

    const signName = this.config.get('SMS_SIGN_NAME', '桑芽记')
    const templateCode = this.config.get('SMS_TEMPLATE_CODE')

    if (!templateCode) {
      this.logger.error('SMS_TEMPLATE_CODE 未配置，回退到开发模式')
      this.logger.warn(`[FALLBACK] 手机号 ${phone} 的验证码: ${code}`)
      return
    }

    const request = new Dysmsapi.SendSmsRequest({
      phoneNumbers: phone,
      signName,
      templateCode,
      templateParam: JSON.stringify({ code }),
    })

    const runtime = new Util.RuntimeOptions({})

    try {
      const response = await this.smsClient.sendSmsWithOptions(request, runtime)
      if (response.body?.code !== 'OK') {
        this.logger.error(`短信发送失败: ${response.body?.code} - ${response.body?.message}`)
        throw new BadRequestException(`短信发送失败: ${response.body?.message}`)
      }
      this.logger.log(`验证码已发送至 ${phone}`)
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      this.logger.error('短信发送异常:', error)
      throw new BadRequestException('短信发送失败，请稍后再试')
    }
  }

  /** 验证验证码 */
  verifyCode(phone: string, code: string): boolean {
    const entry = this.codeStore.get(phone)
    if (!entry) return false
    if (Date.now() > entry.expiresAt) {
      this.codeStore.delete(phone)
      return false
    }
    if (entry.code !== code) return false
    // 验证成功后删除，一次性使用
    this.codeStore.delete(phone)
    return true
  }

  private generateCode(): string {
    return String(Math.floor(100000 + Math.random() * 900000))
  }
}
