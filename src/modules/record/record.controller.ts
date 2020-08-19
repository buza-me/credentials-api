import {
  Controller,
  Get,
  Body,
  Patch,
  Query,
  Post,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { Record } from './record.schema';
import { RecordService } from './record.service';
import { CreateRecordDto, UpdateRecordDto } from './dto';
import { validateUserId } from '../../utils/helpers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('record')
@Controller('record')
export class RecordController {
  constructor(private readonly service: RecordService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createDto: CreateRecordDto,
    @Request() req,
  ): Promise<Record> {
    return await this.service.create({ ...createDto, userId: req.user._id });
  }

  @ApiQuery({ name: '$id', required: false })
  @ApiQuery({ name: '$parentId', required: false })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findOne(
    @Request() req,
    @Query('$id') id?: string,
    @Query('$parentId') parentId?: string,
  ): Promise<Record> | never {
    const found = await this.service.findOne({ id, parentId });
    if (found) {
      validateUserId(found.userId, req.user._id);
      return found;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Query('$id') id: string,
    @Body() updateDto: UpdateRecordDto,
    @Request() req,
  ): Promise<Record> | never {
    const found = await this.service.findOneById(id);
    if (found) {
      validateUserId(found.userId, req.user._id);
      return await this.service.updateOne(id, updateDto);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(
    @Query('$id') id: string,
    @Request() req,
  ): Promise<void> | never {
    const found = await this.service.findOneById(id);
    if (found) {
      validateUserId(found.userId, req.user._id);
      return await this.service.deleteOne(id);
    }
  }
}
