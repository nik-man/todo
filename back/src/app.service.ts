import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './tasks/task.schema';
import { TaskDto } from './app.controller';
import { Subject } from './subjects/subject.schema';

export type TTask = {
  id: string,
  text: string,
  state: string,
  subject: TSubject,
};

export type TSubject = {
  id: string,
  name: string,
};

type TaskAggRecord = Task & {
  subjects: Subject[],
};

@Injectable()
export class AppService {

  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(Subject.name) private readonly subjectModel: Model<Subject>
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getList(): Promise<TTask[]> {
    const tars: TaskAggRecord[] = await this.taskModel.aggregate([
      {
        $lookup:
        {
          from: "subjects",
          localField: "subject",
          foreignField: "_id",
          as: "subjects" // can be any else name
        }
      }
    ]);
    // const dbTasks = await this.taskModel.find().exec();
    const tasks = tars.map(taskAggRec2Task);
    console.log(tasks);
    return tasks;
  }

  async getListSubjects(): Promise<TSubject[]> {
    const subjs: Subject[] = await this.subjectModel.find().exec();
    const res = subjs.map((subj) => { return { id: subj._id, name: subj.name }; });
    console.log(res);
    return res;
  }

  async updateTask({ id, text, state }: Partial<TTask>) {
    if (!id) { return; }
    const task = await this.taskModel.findOne({ _id: id }).exec();
    if (!task) { return; }
    if (state && task.state !== state) {
      await this.taskModel.updateOne({ _id: id }, { state }).exec();
    }
    if (text && task.text !== text) {
      await this.taskModel.updateOne({ _id: id }, { text }).exec();
    }
  }

  async deleteTask(id: string) {
    if (!id) { return; }
    const res = await this.taskModel.deleteOne({ _id: id }).exec();
  }

  async createTask(text: string): Promise<TTask> {
    const newTaskDto: TaskDto = { text, state: 'todo' };
    const createdTask = new this.taskModel(newTaskDto);
    const newDbTask: Task = await createdTask.save();
    return dbTask2Task(newDbTask);
  }
}

function dbTask2Task({ _id, text, state }: Task): TTask {
  return { id: _id, text, state, subject: { id: '', name: '' } };
}

function taskAggRec2Task(TaskAR: TaskAggRecord): TTask {
  const { _id, text, state, subjects } = TaskAR;
  if (subjects.length === 0) {
    return { id: _id, text, state, subject: { id: '', name: '' } };
  }
  return {
    id: _id, text, state,
    subject: {
      id: subjects[0]._id,
      name: subjects[0].name
    }
  };
}