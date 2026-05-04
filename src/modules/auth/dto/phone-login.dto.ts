import { IsString, Matches, Length } from 'class-validator'

export class PhoneLoginDto {
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string

  @IsString()
  @Length(4, 6, { message: '验证码长度为4-6位' })
  code: string
}
