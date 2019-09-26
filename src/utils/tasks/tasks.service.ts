import { Injectable } from '@nestjs/common';
const cron = require('cron');

@Injectable()
export class TasksService {
  async Timeout() {
    const taskID = setTimeout(() => console.log('Task completed'), 2000);
    // clearTimeout(taskID);
  }

  async Interval() {
    const intervalID = setInterval(() => console.log('Task executed'), 2000);
    // clearInterval(intervalID);
  }

  async Cron() {
    const cronJob = cron.job('*/1 * * * * *', () => {
      console.info('Cron job completed');
    });
    cronJob.start();
  }
}
