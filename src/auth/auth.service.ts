import { Injectable } from '@nestjs/common';
import { getMongoRepository } from 'typeorm';
import { sign, verify } from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-core';
import { User } from '../models/user.entity';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
  async generateToken(user: User): Promise<string> {
    const token = await sign(
      {
        issuer: 'http://acexis.dev.io',
        subject: user._id,
        audience: user.email,
      },
      process.env.SECRET_KEY!,
      {
        expiresIn: '30d',
      },
    );

    return token;
  }

  async tradeToken(email: string, password: string): Promise<string> {
    const user = await getMongoRepository(User).findOne({ email });

    if (!user || !(await user.matchesPassword(password))) {
      throw new ApolloError('Unauthorized', '401', {});
    }

    return this.generateToken(user);
  }

  async verifyToken(token: string): Promise<User> {
    try {
      let currentUser;

      const decodeToken = await verify(token, process.env.SECRET_KEY!);

      currentUser = await getMongoRepository(User).findOne({
        _id: decodeToken.subject,
      });

      return currentUser;
    } catch (error) {
      throw new ApolloError('Invalid Token', '498', {});
    }
  }
}
