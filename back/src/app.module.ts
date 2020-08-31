import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './tasks/task.schema';
import { Subject, SubjectSchema } from './subjects/subject.schema';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/todo'),
  MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
