import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFolderDto {
  @ApiProperty()
  @IsOptional()
  readonly name: string;

  @IsOptional()
  readonly parentId: string;

  @IsNotEmpty()
  readonly updateTime: any;
}
