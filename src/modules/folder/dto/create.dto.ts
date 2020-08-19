import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly parentId: string;

  @IsNotEmpty()
  readonly userId: string;

  @IsNotEmpty()
  readonly createTime: any;

  @IsNotEmpty()
  readonly updateTime: any;
}
