import { Controller, Get, Post, Body, Query } from '@nestjs/common'
import { TaskService } from './task.service'

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('templates')
  async getTemplates(@Query('stageId') stageId: string) {
    return this.taskService.getTaskTemplates(stageId)
  }

  @Post('complete')
  async completeTask(@Body() body: { projectId: string; templateId: string; date: string; completedBy: string }) {
    return this.taskService.completeTask(body)
  }

  @Get('completions')
  async getCompletions(@Query('projectId') projectId: string, @Query('date') date: string) {
    return this.taskService.getTaskCompletions(projectId, date)
  }
}
