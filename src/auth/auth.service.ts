import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto, SignInDto } from 'src/user/dto/create-user.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor() {}
  prisma = new PrismaClient();

  async signUp(newUser: CreateUserDto) {
    console.log(newUser);
    
    let {full_name, email, pass_word, phone} = newUser;
    let checkUser = await this.prisma.user.findMany({
      where: {email},
    });

    if(checkUser.length > 0){
      return {success: false, message: "That email is taken. Try another."}
    };
    
    const data = await this.prisma.user.create({
      data: {
        full_name,
        email,
        pass_word,
        phone
      }
    })
    return {success: true, message: data}
  }

  async signIn(user: SignInDto) {
    let {email, pass_word} = user
    const data = await this.prisma.user.findFirst({
      where: {
        email,
        pass_word
      }
    })
    if(data){
      return {success: true, message: "login success"}
    }
  }
}
