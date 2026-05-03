import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: {
    name: string
    silkwormCount: number
    startDate: string
    ageMode: string
  }) {
    return this.prisma.project.create({
      data: {
        userId,
        name: data.name,
        silkwormCount: data.silkwormCount,
        startDate: new Date(data.startDate),
        currentStageId: 'egg',
        currentStageStartedAt: new Date(data.startDate),
        settings: {
          morningReminderTime: '08:00',
          eveningReminderTime: '19:00',
          enablePush: true,
        },
      },
    })
  }

  async findByUserId(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findActiveByUserId(userId: string) {
    return this.prisma.project.findFirst({
      where: { userId, status: 'active' },
    })
  }

  async adjustStage(projectId: string, newStageId: string) {
    // 记录阶段日志
    await this.prisma.stageLog.create({
      data: {
        projectId,
        stageId: newStageId,
        startedAt: new Date(),
        isManualAdjust: true,
      },
    })

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        currentStageId: newStageId,
        currentStageStartedAt: new Date(),
        isAutoStage: false,
      },
    })
  }

  async complete(projectId: string) {
    return this.prisma.project.update({
      where: { id: projectId },
      data: { status: 'completed' },
    })
  }
}
