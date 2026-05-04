import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async verifyProjectOwnership(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } })
    if (!project) {
      throw new NotFoundException('项目不存在')
    }
    if (project.userId !== userId) {
      throw new ForbiddenException('无权访问此项目')
    }
  }

  async getTaskTemplates(stageId: string) {
    return this.prisma.taskTemplate.findMany({
      where: { stageId },
      orderBy: [{ priority: 'asc' }, { sortOrder: 'asc' }],
    })
  }

  async completeTask(data: { projectId: string; templateId: string; date: string; completedBy: string }) {
    return this.prisma.taskLog.create({
      data: {
        projectId: data.projectId,
        templateId: data.templateId,
        // 同时写入 taskTemplateId FK 字段
        taskTemplateId: data.templateId,
        date: new Date(data.date),
        completedBy: data.completedBy,
      },
    })
  }

  async getTaskCompletions(projectId: string, date: string) {
    return this.prisma.taskLog.findMany({
      where: {
        projectId,
        date: new Date(date),
      },
    })
  }
}
