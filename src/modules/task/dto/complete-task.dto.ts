import { IsString, IsDateString } from 'class-validator'

export class CompleteTaskDto {
  @IsString()
  projectId: string

  @IsString()
  templateId: string

  @IsDateString()
  date: string

  @IsString()
  completedBy: string
}
