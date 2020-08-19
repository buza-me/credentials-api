import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { validateUserId } from '../../utils/helpers';
import { User } from './user.schema';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  async create(@Body() createDto: CreateUserDto): Promise<string> {
    return await this.service.create(createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findOne(
    @Query('$id') id: string,
    @Request() req: JwtRequest,
  ): Promise<Partial<User>> | never {
    validateUserId(id, req.user._id);
    return await this.service.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Query('$id') id: string,
    @Body() updateDto: UpdateUserDto,
    @Request() req: JwtRequest,
  ): Promise<User> | never {
    validateUserId(id, req.user._id);
    return await this.service.updateOne(id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(
    @Query('$id') id: string,
    @Request() req: JwtRequest,
  ): Promise<void> | never {
    validateUserId(id, req.user._id);
    return await this.service.deleteOne(id);
  }
}
