import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecordDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly login: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;

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
