import {
  Controller,
  Get,
  Body,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreferencesService } from './preferences.service';
import { UpdatePreferencesDto } from './dto';
import { validateUserId } from '../../utils/helpers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Preferences } from './preferences.schema';

@ApiTags('user preferences')
@Controller('preferences')
export class PreferencesController {
  constructor(private readonly service: PreferencesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findOne(
    @Query('$userid') userid: string,
    @Request() req: JwtRequest,
  ): Promise<Preferences> | never {
    validateUserId(userid, req.user._id);
    return await this.service.findOneByUserId(userid);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Query('$id') id: string,
    @Body() updateDto: UpdatePreferencesDto,
    @Request() req: JwtRequest,
  ): Promise<Preferences> | never {
    const found = await this.service.findOneById(id);
    if (found) {
      validateUserId(found.userId, req.user._id);
      return await this.service.updateOne(id, updateDto);
    }
  }
}
