import { Injectable } from '@nestjs/common';
import cron from 'cron';

@Injectable()
export class TasksService {
  async timeout() {
    const taskID = setTimeout(() => console.log('Task completed'), 2000);
    clearTimeout(taskID);
  }

  async interval() {
    const intervalID = setInterval(() => console.log('Task executed'), 2000);
    clearInterval(intervalID);
  }

  async cron() {
    const job = cron.job('*/5 * * * *', () => console.log('Message every 5s'));
    job.start();
  }
}
