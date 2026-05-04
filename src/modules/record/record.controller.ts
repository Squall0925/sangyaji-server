import { Controller, Post, Get, Delete, Body, Param, Query, ForbiddenException } from '@nestjs/common'
import { RecordService } from './record.service'
import { CurrentUserId } from '../../common/decorators/current-user.decorator'
import { CreateRecordDto } from './dto/create-record.dto'

@Controller('records')
export class RecordController {
  constructor(private recordService: RecordService) {}

  @Post()
  async create(
    @CurrentUserId() userId: string,
    @Body() dto: CreateRecordDto,
  ) {
    await this.recordService.verifyProjectOwnership(dto.projectId, userId)
    return this.recordService.create(dto)
  }

  @Get()
  async list(
    @CurrentUserId() userId: string,
    @Query('projectId') projectId: string,
    @Query('stageId') stageId?: string,
  ) {
    await this.recordService.verifyProjectOwnership(projectId, userId)
    return this.recordService.findByProject(projectId, { stageId })
  }

  @Get('by-date')
  async listByDate(
    @CurrentUserId() userId: string,
    @Query('projectId') projectId: string,
    @Query('date') date: string,
  ) {
    await this.recordService.verifyProjectOwnership(projectId, userId)
    return this.recordService.findByDate(projectId, date)
  }

  @Delete(':id')
  async delete(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ) {
    await this.recordService.verifyRecordOwnership(id, userId)
    return this.recordService.delete(id)
  }
}
