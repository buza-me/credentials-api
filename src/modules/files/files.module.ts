import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FolderModule } from '../folder/folder.module';
import { RecordModule } from '../record/record.module';

@Module({
  imports: [FolderModule, RecordModule],
  controllers: [FilesController],
  providers: [],
  exports: [],
})
export class FilesModule {}
