import { Injectable } from '@nestjs/common';
import { db, Task } from './app.adapter';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getList(): Task[] {
    return db.tasks;
  }
}
