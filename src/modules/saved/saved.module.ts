import { Module } from '@nestjs/common';
import { SavedController } from './saved.controller';
import { FolderModule } from '../folder/folder.module';
import { RecordModule } from '../record/record.module';

@Module({
  imports: [FolderModule, RecordModule],
  controllers: [SavedController],
  providers: [],
  exports: [],
})
export class SavedModule {}
