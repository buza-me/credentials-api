import {
  Controller,
  Get,
  Body,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreferencesService } from './preferences.service';
import { UpdatePreferencesDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Preferences } from './preferences.schema';

@ApiTags('user preferences')
@Controller('preferences')
export class PreferencesController {
  constructor(private readonly service: PreferencesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findOne(@Request() req: JwtRequest): Promise<Preferences> {
    return await this.service.findOneByUserId(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Body() updateDto: UpdatePreferencesDto,
    @Request() req: JwtRequest,
  ): Promise<Preferences> | never {
    const found = await this.service.findOneByUserId(req.user._id);
    if (found) {
      return await this.service.updateOne(found._id, updateDto);
    }
  }
}
