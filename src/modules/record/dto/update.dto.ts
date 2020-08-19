import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRecordDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly login: string;

  @ApiProperty()
  readonly password: string;

  @IsNotEmpty()
  readonly updateTime: any;
}
