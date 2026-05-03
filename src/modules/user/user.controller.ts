import { Controller, Get, Patch, Body } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile() {
    // TODO: 从JWT中获取userId
    return { message: '获取用户信息' }
  }

  @Patch('profile')
  async updateProfile(@Body() body: { nickname?: string; avatarUrl?: string; ageMode?: string }) {
    // TODO: 从JWT中获取userId
    return { message: '更新用户信息' }
  }

  @Patch('toggle-child-mode')
  async toggleChildMode() {
    // TODO: 从JWT中获取userId
    return { message: '切换儿童模式' }
  }
}
