import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Record extends Document {
  @Prop({ default: 'record' })
  objectType: string;

  @Prop()
  createTime: Date;

  @Prop()
  updateTime: Date;

  @Prop()
  name: string;

  @Prop()
  login: string;

  @Prop()
  password: string;

  @Prop()
  parentId: string;

  @Prop()
  userId: string;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
