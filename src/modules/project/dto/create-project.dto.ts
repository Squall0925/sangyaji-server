import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateProjectDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  silkwormCount?: number

  @IsDateString()
  startDate: string

  @IsOptional()
  @IsString()
  ageMode?: string
}
