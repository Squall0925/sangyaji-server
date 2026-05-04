import { Controller, Get, Post, Body, Query, ForbiddenException } from '@nestjs/common'
import { TaskService } from './task.service'
import { CurrentUserId } from '../../common/decorators/current-user.decorator'
import { CompleteTaskDto } from './dto/complete-task.dto'

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('templates')
  async getTemplates(@Query('stageId') stageId: string) {
    return this.taskService.getTaskTemplates(stageId)
  }

  @Post('complete')
  async completeTask(
    @CurrentUserId() userId: string,
    @Body() dto: CompleteTaskDto,
  ) {
    await this.taskService.verifyProjectOwnership(dto.projectId, userId)
    return this.taskService.completeTask(dto)
  }

  @Get('completions')
  async getCompletions(
    @CurrentUserId() userId: string,
    @Query('projectId') projectId: string,
    @Query('date') date: string,
  ) {
    await this.taskService.verifyProjectOwnership(projectId, userId)
    return this.taskService.getTaskCompletions(projectId, date)
  }
}
