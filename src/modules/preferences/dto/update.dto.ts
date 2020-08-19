import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePreferencesDto {
  @ApiProperty()
  @IsOptional()
  readonly theme: string;

  @ApiProperty()
  @IsOptional()
  readonly language: string;

  @IsNotEmpty()
  readonly updateTime: any;
}
