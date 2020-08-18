import { Injectable } from '@nestjs/common';
import { db, TTask } from './app.adapter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './tasks/task.schema';
import { TaskDto } from './app.controller';

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

  updateTask({ id, text, state }: TTask) {
    const taskIndex = db.tasks.findIndex(task => task.id === id);
    if (taskIndex < 0) { return; }
    const task = db.tasks[taskIndex];
    if (state && task.state !== state) {
      task.state = state;
      db.tasks[taskIndex] = task;
    }
    if (text && task.text !== text) {
      task.text = text;
      db.tasks[taskIndex] = task;
    }
  }

  deleteTask(id: string) {
    if (!id) { return; }
    const taskIndex = db.tasks.findIndex(task => task.id === id);
    if (taskIndex < 0) { return; }
    db.tasks.splice(taskIndex, 1);
  }

  async createTask(text: string): Promise<TTask> {
    // const id = db.tasks.reduce<number>((maxId, task) => Math.max(maxId, task.id), 0) + 1;
    /* const id = 'newID';
    const newTask: TTask = { id, text, state: 'todo' };
    db.tasks.push(newTask); */
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
