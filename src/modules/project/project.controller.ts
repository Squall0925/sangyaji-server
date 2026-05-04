import { Controller, Post, Get, Patch, Body, Param, UseGuards, ForbiddenException } from '@nestjs/common'
import { ProjectService } from './project.service'
import { CurrentUserId } from '../../common/decorators/current-user.decorator'
import { CreateProjectDto } from './dto/create-project.dto'

@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  async create(
    @CurrentUserId() userId: string,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectService.create(userId, dto)
  }

  @Get()
  async list(@CurrentUserId() userId: string) {
    return this.projectService.findByUserId(userId)
  }

  @Get('active')
  async getActive(@CurrentUserId() userId: string) {
    return this.projectService.findActiveByUserId(userId)
  }

  @Patch(':id/adjust-stage')
  async adjustStage(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body('stageId') stageId: string,
  ) {
    await this.projectService.verifyOwnership(id, userId)
    return this.projectService.adjustStage(id, stageId)
  }

  @Patch(':id/complete')
  async complete(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ) {
    await this.projectService.verifyOwnership(id, userId)
    return this.projectService.complete(id)
  }
}
