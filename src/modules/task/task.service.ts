import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

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
