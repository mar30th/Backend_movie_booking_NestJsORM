import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  getUser() {
    const data = this.prisma.user.findMany()
    return data
  }
}
