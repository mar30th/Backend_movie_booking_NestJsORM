import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto, SignInDto } from 'src/user/dto/create-user.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  prisma = new PrismaClient();

  async signUp(newUser: CreateUserDto) {
    let { full_name, email, pass_word, phone } = newUser;
    let checkUser = await this.prisma.user.findMany({
      where: { email },
    });

    if (checkUser.length > 0) {
      return { success: false, message: 'That email is taken. Try another.' };
    }
    const hashedPassword = await bcrypt.hashSync(pass_word, 10);
    const dataUser = await this.prisma.user.create({
      data: {
        full_name,
        email,
        phone,
        pass_word: hashedPassword,
      },
      select: {
        full_name: true,
        email: true,
        phone: true,
        user_type: true,
      },
    });
    return { success: true, message: dataUser };
  }

  async signIn(userLogin: SignInDto) {
    let { email, pass_word } = userLogin;
    let checkUser = await this.prisma.user.findFirst({
      where: { email },
    });
    if (checkUser) {
      if (bcrypt.compareSync(pass_word, checkUser.pass_word)) {
        const { pass_word: passwordToRemove, ...dataRemovePass } = checkUser;
        let token = await this.jwtService.signAsync(
          { data: dataRemovePass },
          { secret: this.configService.get('KEY'), expiresIn: '30m' },
        );
        return {
          success: true,
          data: token,
          message: 'Welcome back, Login successfully',
        };
      } else {
        return { success: false, message: 'Wrong password, try again!' };
      }
    } else {      
      return {
        success: false,
        message: "Couldn't find your Email account, please try again!",
      };
    }
  }
  
}
