import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  readonly updateTime: any;
}
