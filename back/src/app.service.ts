import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './tasks/task.schema';
import { TaskDto } from './app.controller';

export type TTask = {
  id: string,
  text: string,
  state: string,
};

@Injectable()
export class AppService {

  constructor(@InjectModel(Task.name) private readonly taskModel: Model<Task>) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getList(): Promise<TTask[]> {
    const dbTasks = await this.taskModel.find().exec();
    const tasks = dbTasks.map((task) => {
      return { id: task._id, text: task.text, state: task.state };
    });
    return tasks;
  }

  async updateTask({ id, text, state }: TTask) {
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
    console.log(res);
  }

  async createTask(text: string): Promise<TTask> {
    const newTaskDto: TaskDto = { text, state: 'todo' };
    const createdTask = new this.taskModel(newTaskDto);
    const newDbTask: Task = await createdTask.save();
    console.log(newDbTask);
    return dbTask2Task(newDbTask);
  }
}

function dbTask2Task({ _id, text, state }: Task): TTask {
  return { id: _id, text, state };
}
