import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';
import { Preferences, PreferencesSchema } from './preferences.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Preferences.name, schema: PreferencesSchema },
    ]),
  ],
  controllers: [PreferencesController],
  providers: [PreferencesService],
  exports: [PreferencesService],
})
export class PreferencesModule {}
