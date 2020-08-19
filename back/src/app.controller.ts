import { Controller, Get, Put, Param, Query, Delete, Post, Body } from '@nestjs/common';
import { AppService, TTask } from './app.service';

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
  async getList(): Promise<TTask[]> {
    return await this.appService.getList();
  }

  @Put('task/:id')
  updateTask(@Param('id') id: string, @Query() params: TaskDto) {
    if (!id || !params) { return {}; }
    this.appService.updateTask({ id, ...params });
    return {};
  }

  @Delete('task/:id')
  deleteTask(@Param('id') id: string) {
    if (!id) { return; }
    this.appService.deleteTask(id);
    return {};
  }

  @Post('task')
  async createTask(@Body() { text }: TaskDto) {
    if (!text) { return; }
    return await this.appService.createTask(text);
  }
}
