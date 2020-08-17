import { Controller, Get, Put, Param, Query, Delete, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Task } from './app.adapter';

export class TaskDto {
  text: string;
  state: string;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('list')
  getList(): Task[] {
    return this.appService.getList();
  }

  @Put('task/:id')
  updateTask(@Param('id') sid: string, @Query() params: TaskDto) {
    if (!sid || !params) { return {}; }
    const id = parseInt(sid);
    this.appService.updateTask({ id, ...params });
    return {};
  }

  @Delete('task/:id')
  deleteTask(@Param('id') sid: string) {
    if (!sid) { return; }
    this.appService.deleteTask(parseInt(sid));
    return {};
  }

  @Post('task')
  createTask(@Body() { text }: TaskDto) {
    if (!text) { return; }
    return this.appService.createTask(text);
  }
}
