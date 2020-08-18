import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class Task extends Document {
  @Prop()
  text: string;

  @Prop()
  state: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
