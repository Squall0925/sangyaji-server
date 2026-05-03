import { Controller, Post, Get, Param, Body } from '@nestjs/common'
import { DiaryService } from './diary.service'

@Controller('diary')
export class DiaryController {
  constructor(private diaryService: DiaryService) {}

  @Post('generate')
  async generate(@Body('projectId') projectId: string) {
    return this.diaryService.generate(projectId)
  }

  @Get('project/:projectId')
  async findByProject(@Param('projectId') projectId: string) {
    return this.diaryService.findByProject(projectId)
  }

  @Post(':id/regenerate')
  async regenerate(@Param('id') id: string) {
    return this.diaryService.regenerate(id)
  }
}
