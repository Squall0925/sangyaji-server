import { Controller, Post, Get, Delete, Body, Param, Query } from '@nestjs/common'
import { RecordService } from './record.service'

@Controller('records')
export class RecordController {
  constructor(private recordService: RecordService) {}

  @Post()
  async create(@Body() body: any) {
    // TODO: 从JWT中获取userId验证权限
    return this.recordService.create(body)
  }

  @Get()
  async list(@Query('projectId') projectId: string, @Query('stageId') stageId?: string) {
    return this.recordService.findByProject(projectId, { stageId })
  }

  @Get('by-date')
  async listByDate(@Query('projectId') projectId: string, @Query('date') date: string) {
    return this.recordService.findByDate(projectId, date)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.recordService.delete(id)
  }
}
