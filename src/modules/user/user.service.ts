import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } })
  }

  async updateProfile(id: string, data: { nickname?: string; avatarUrl?: string; ageMode?: string; isChildMode?: boolean }) {
    return this.prisma.user.update({ where: { id }, data })
  }

  async toggleChildMode(id: string) {
    const user = await this.findById(id)
    if (!user) return null
    return this.prisma.user.update({
      where: { id },
      data: { isChildMode: !user.isChildMode },
    })
  }
}
