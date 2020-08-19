import { IsNotEmpty } from 'class-validator';

export class CreatePreferencesDto {
  @IsNotEmpty()
  readonly theme: string;

  @IsNotEmpty()
  readonly language: string;

  @IsNotEmpty()
  readonly userId: string;

  @IsNotEmpty()
  readonly createTime: any;

  @IsNotEmpty()
  readonly updateTime: any;
}
