import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_URI, MONGO_OPTIONS } from './db/config';
import {
  UserModule,
  PreferencesModule,
  FolderModule,
  RecordModule,
  AuthModule,
  SavedModule,
} from './modules';

const imports = [
  MongooseModule.forRoot(MONGO_URI, MONGO_OPTIONS),
  PreferencesModule,
  FolderModule,
  RecordModule,
  UserModule,
  AuthModule,
  SavedModule,
];

@Module({
  imports,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
