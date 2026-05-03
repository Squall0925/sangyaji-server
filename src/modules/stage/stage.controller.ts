import { Controller, Get, Param } from '@nestjs/common'
import { StageService } from './stage.service'

@Controller('stages')
export class StageController {
  constructor(private stageService: StageService) {}

  @Get()
  async list() {
    return this.stageService.getAllStages()
  }

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    return this.stageService.getStageById(id)
  }
}
