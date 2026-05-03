import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'

@Injectable()
export class RecordService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    projectId: string
    date: string
    stageId: string
    dayInStage: number
    authorType: string
    authorName?: string
    textContent?: string
    tags?: string[]
    weather?: string
    temperature?: number
    mood?: string
    linkedTaskIds?: string[]
    mediaItems?: { type: string; url: string; thumbnailUrl?: string; duration?: number; fileSize?: number; width?: number; height?: number }[]
  }) {
    const { mediaItems, ...recordData } = data
    return this.prisma.record.create({
      data: {
        ...recordData,
        date: new Date(data.date),
        tags: data.tags ?? [],
        linkedTaskIds: data.linkedTaskIds ?? [],
        mediaItems: mediaItems
          ? {
              create: mediaItems.map((m, i) => ({
                type: m.type,
                url: m.url,
                thumbnailUrl: m.thumbnailUrl,
                duration: m.duration,
                fileSize: m.fileSize,
                width: m.width,
                height: m.height,
                sortOrder: i,
              })),
            }
          : undefined,
      },
      include: { mediaItems: true },
    })
  }

  async findByProject(projectId: string, options?: { stageId?: string; limit?: number; offset?: number }) {
    return this.prisma.record.findMany({
      where: {
        projectId,
        ...(options?.stageId ? { stageId: options.stageId } : {}),
      },
      include: { mediaItems: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { date: 'desc' },
      take: options?.limit ?? 50,
      skip: options?.offset ?? 0,
    })
  }

  async findByDate(projectId: string, date: string) {
    return this.prisma.record.findMany({
      where: { projectId, date: new Date(date) },
      include: { mediaItems: { orderBy: { sortOrder: 'asc' } } },
    })
  }

  async delete(id: string) {
    return this.prisma.record.delete({ where: { id } })
  }
}
