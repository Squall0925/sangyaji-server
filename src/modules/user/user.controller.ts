import { Controller, Get, Patch, Body, NotFoundException } from '@nestjs/common'
import { UserService } from './user.service'
import { CurrentUserId } from '../../common/decorators/current-user.decorator'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile(@CurrentUserId() userId: string) {
    const user = await this.userService.findById(userId)
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    return user
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    const user = await this.userService.updateProfile(userId, dto)
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    return user
  }

  @Patch('toggle-child-mode')
  async toggleChildMode(@CurrentUserId() userId: string) {
    const user = await this.userService.toggleChildMode(userId)
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    return user
  }
}
