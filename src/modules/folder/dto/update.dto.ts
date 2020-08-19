import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFolderDto {
  @ApiProperty()
  @IsOptional()
  readonly name: string;

  @IsNotEmpty()
  readonly updateTime: any;
}
