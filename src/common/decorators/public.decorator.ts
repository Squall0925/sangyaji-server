import { SetMetadata } from '@nestjs/common'

/** 标记接口不需要JWT认证 */
export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
