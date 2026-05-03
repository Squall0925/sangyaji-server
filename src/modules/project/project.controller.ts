import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common'
import { ProjectService } from './project.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUserId } from '../../common/decorators/current-user.decorator'

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  async create(
    @CurrentUserId() userId: string,
    @Body() body: { name: string; silkwormCount: number; startDate: string; ageMode: string },
  ) {
    return this.projectService.create(userId, body)
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
  async adjustStage(@Param('id') id: string, @Body('stageId') stageId: string) {
    return this.projectService.adjustStage(id, stageId)
  }

  @Patch(':id/complete')
  async complete(@Param('id') id: string) {
    return this.projectService.complete(id)
  }
}
