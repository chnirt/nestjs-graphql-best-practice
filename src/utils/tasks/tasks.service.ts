import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class TasksService implements OnModuleInit {
  onModuleInit() {
    console.log(`Initialization...`);
    this.cron();
  }

  async timeout() {
    const taskID = setTimeout(() => console.log('Task completed'), 2000);
    clearTimeout(taskID);
  }

  async interval() {
    const intervalID = setInterval(() => console.log('Task executed'), 2000);
    clearInterval(intervalID);
  }

  async cron() {
    const cron = require('cron');
    const cronJob = cron.job('*/1 * * * * *', () => {
      // perform operation e.g. GET request http.get() etc.
      console.info('cron job completed');
    });
    cronJob.start();
  }
}
