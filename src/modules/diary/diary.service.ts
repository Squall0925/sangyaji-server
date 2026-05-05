import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../common/prisma.service'

@Injectable()
export class DiaryService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  /** 触发AI日记本生成 */
  async generate(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        records: {
          include: { mediaItems: true },
          orderBy: { date: 'asc' },
        },
      },
    })

    if (!project) throw new Error('项目不存在')

    // 创建日记本记录
    const diaryBook = await this.prisma.diaryBook.create({
      data: {
        projectId,
        status: 'generating',
        generationConfig: {
          ageMode: (project.settings as any)?.ageMode ?? 'standard',
          model: 'qwen-max',
        },
      },
    })

    // TODO: 投入BullMQ异步队列进行AI生成
    // 这里先实现同步版本作为演示
    try {
      const content = await this.callAIGenerate(project)
      await this.prisma.diaryBook.update({
        where: { id: diaryBook.id },
        data: {
          status: 'completed',
          contentJson: content,
          totalWords: this.countWords(content),
          generatedAt: new Date(),
        },
      })
    } catch (error) {
      await this.prisma.diaryBook.update({
        where: { id: diaryBook.id },
        data: { status: 'failed' },
      })
      throw error
    }

    return this.prisma.diaryBook.findUnique({ where: { id: diaryBook.id } })
  }

  /** 获取日记本 */
  async findByProject(projectId: string) {
    return this.prisma.diaryBook.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    })
  }

  /** 重新生成 */
  async regenerate(diaryBookId: string) {
    const diaryBook = await this.prisma.diaryBook.findUnique({
      where: { id: diaryBookId },
    })
    if (!diaryBook) throw new Error('日记本不存在')

    await this.prisma.diaryBook.update({
      where: { id: diaryBookId },
      data: {
        regenerateCount: { increment: 1 },
        status: 'generating',
      },
    })

    // TODO: 投入队列重新生成
    return { message: '重新生成已提交' }
  }

  /** 调用AI生成日记内容（核心方法） */
  private async callAIGenerate(project: any): Promise<any> {
    // TODO: 实现完整的AI调用链路
    // 1. 按阶段分组整理记录
    // 2. 筛选代表图片
    // 3. 构建结构化Prompt
    // 4. 调用AI API
    // 5. 解析返回结果

    const ageMode = JSON.parse(project.settings as string || '{}').ageMode ?? 'standard'
    const childAge = ageMode === 'junior' ? '5' : '10'

    const prompt = `你是一个儿童文学作家和昆虫学爱好者，正在帮助一个${childAge}岁的孩子写养蚕日记。
请基于以下记录生成一本养蚕日记，使用第一人称，语气贴近该年龄段儿童。
每个阶段写一篇200-400字的日记，包含日期、观察记录和"你知道吗"知识框。
严格基于实际记录，不编造未记录的事件。

项目名称：${project.name}
开始日期：${project.startDate}
记录数：${project.records?.length ?? 0}`

    // 开发阶段返回占位内容
    return {
      prompt,
      placeholder: true,
      message: 'AI日记本生成功能待接入正式API后启用',
    }
  }

  private countWords(content: any): number {
    if (!content) return 0
    const text = JSON.stringify(content)
    return text.length
  }
}
