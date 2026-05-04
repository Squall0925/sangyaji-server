import { IsString, IsInt, IsOptional, IsDateString, IsArray } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateRecordDto {
  @IsString()
  projectId: string

  @IsDateString()
  date: string

  @IsString()
  stageId: string

  @Type(() => Number)
  @IsInt()
  dayInStage: number

  @IsOptional()
  @IsString()
  authorType?: string

  @IsOptional()
  @IsString()
  authorName?: string

  @IsOptional()
  @IsString()
  textContent?: string

  @IsOptional()
  @IsArray()
  tags?: string[]

  @IsOptional()
  @IsString()
  weather?: string

  @IsOptional()
  @Type(() => Number)
  temperature?: number

  @IsOptional()
  @IsString()
  mood?: string

  @IsOptional()
  @IsArray()
  linkedTaskIds?: string[]
}
