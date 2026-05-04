import { IsString, IsOptional, IsIn } from 'class-validator'

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  nickname?: string

  @IsOptional()
  @IsString()
  avatarUrl?: string

  @IsOptional()
  @IsIn(['junior', 'standard'], { message: 'ageMode 只能是 junior 或 standard' })
  ageMode?: string
}
