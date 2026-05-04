import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: {
    name?: string
    silkwormCount?: number
    startDate: string
    ageMode?: string
  }) {
    return this.prisma.project.create({
      data: {
        userId,
        name: data.name || '我的蚕宝宝',
        silkwormCount: data.silkwormCount ?? 5,
        startDate: new Date(data.startDate),
        currentStageId: 'egg',
        currentStageStartedAt: new Date(data.startDate),
        settings: JSON.stringify({
          morningReminderTime: '08:00',
          eveningReminderTime: '19:00',
          enablePush: true,
        }),
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

  async verifyOwnership(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } })
    if (!project) {
      throw new NotFoundException('项目不存在')
    }
    if (project.userId !== userId) {
      throw new ForbiddenException('无权访问此项目')
    }
    return project
  }

  async adjustStage(projectId: string, newStageId: string) {
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
