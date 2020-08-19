import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Folder extends Document {
  @Prop({ default: 'folder' })
  objectType: string;

  @Prop()
  createTime: Date;

  @Prop()
  updateTime: Date;

  @Prop()
  name: string;

  @Prop()
  parentId: string;

  @Prop()
  userId: string;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
