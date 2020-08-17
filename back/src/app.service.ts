import { Injectable } from '@nestjs/common';
import { db, Task } from './app.adapter';
import { TaskDto } from './app.controller';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getList(): Task[] {
    return db.tasks;
  }

  updateTask({ id, text, state }: Task) {
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

  deleteTask(id: number) {
    if (!id) { return; }
    const taskIndex = db.tasks.findIndex(task => task.id === id);
    if (taskIndex < 0) { return; }
    db.tasks.splice(taskIndex, 1);
  }

  createTask(text: string) {
    const id = db.tasks.reduce<number>((maxId, task) => Math.max(maxId, task.id), 0) + 1;
    const newTask: Task = { id, text, state: 'todo' };
    db.tasks.push(newTask);
    return newTask;
  }
}
