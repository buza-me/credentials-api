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
import { Folder } from './folder.schema';
import { FolderService } from './folder.service';
import { CreateFolderDto, UpdateFolderDto } from './dto';
import { validateUserId } from '../../utils/helpers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('folder')
@Controller('folder')
export class FolderController {
  constructor(private readonly service: FolderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createDto: CreateFolderDto,
    @Request() req: JwtRequest,
  ): Promise<Folder> {
    return await this.service.create({ ...createDto, userId: req.user._id });
  }

  @ApiQuery({ name: '$id', required: false })
  @ApiQuery({ name: '$parentId', required: false })
  @UseGuards(JwtAuthGuard)
  @Get()
  async find(
    @Request() req: JwtRequest,
    @Query('$id') id?: string,
    @Query('$parentId') parentId?: string,
  ): Promise<Folder | Folder[]> {
    if (id) {
      const found = await this.service.findOne(id);
      if (found) {
        validateUserId(found.userId, req.user._id);
        return found;
      }
    }

    if (parentId) {
      return await this.service.findMany(parentId, req.user._id);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Query('$id') id: string,
    @Body() updateDto: UpdateFolderDto,
    @Request() req: JwtRequest,
  ): Promise<Folder> {
    const found = await this.service.findOne(id);
    if (found) {
      validateUserId(found.userId, req.user._id);
      return await this.service.updateOne(id, updateDto);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(
    @Query('$id') id: string,
    @Request() req: JwtRequest,
  ): Promise<void> | never {
    const found = await this.service.findOne(id);
    if (found) {
      validateUserId(found.userId, req.user._id);
      return await this.service.deleteOne(id);
    }
  }
}
