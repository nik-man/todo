import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema, Task } from './tasks/task.schema';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/todo'),
  MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
