import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  // async validateUser(token: string): Promise<any> {
  //   // Validate if token passed along with HTTP request
  //   // is associated with any registered account in the database
  //   return await this.userService.findOneByToken(token);
  // }
}
