import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Preferences extends Document {
  @Prop({ default: 'preferences' })
  objectType: string;

  @Prop()
  createTime: Date;

  @Prop()
  updateTime: Date;

  @Prop()
  theme: string;

  @Prop()
  language: string;

  @Prop()
  userId: string;
}

export const PreferencesSchema = SchemaFactory.createForClass(Preferences);
