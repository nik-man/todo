import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class Subject extends Document {
  @Prop()
  name: string;

  @Prop()
  type: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
