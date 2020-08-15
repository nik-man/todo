import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { Task } from './app.adapter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('list')
  @Header('Access-Control-Allow-Origin', '*')
  getList(): Task[] {
    return this.appService.getList();
  }
}
