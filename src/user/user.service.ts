import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto, DeleteUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private prisma: PrismaClient;
  constructor(private readonly jwtService: JwtService) {
    this.prisma = new PrismaClient();
  }

  async getUserType(access_token: string) {
    try {
      const decodedToken = (await this.jwtService.decode(
        access_token.replace('Bearer ', ''),
      )) as any;
      const user_id = decodedToken?.data?.user_id;
      const checkToken = await this.prisma.user.findFirst({
        where: {
          user_id,
        },
      });
      if (!checkToken) {
        throw new UnauthorizedException('Invalid Token');
      }

      const uniqueUserTypes = new Set<string>();
      const data = await this.prisma.user.findMany({
        select: {
          user_type: true,
        },
      });

      data.forEach((item) => {
        uniqueUserTypes.add(item.user_type);
      });

      const enhancedData = Array.from(uniqueUserTypes).map((user_type) => {
        let type_name = '';
        switch (user_type) {
          case 'regular':
            type_name = 'Normal';
            break;
          case 'admin':
            type_name = 'admin';
            break;
          default:
            type_name = 'Unknown';
        }
        return {
          user_type,
          type_name,
        };
      });
      return { success: true, messsage: 'success', data: enhancedData };
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }

  async getUser(access_token: string) {
    try {
      const decodedToken = (await this.jwtService.decode(
        access_token.replace('Bearer ', ''),
      )) as any;
      const user_id = decodedToken?.data?.user_id;
      const checkToken = await this.prisma.user.findFirst({
        where: {
          user_id,
        },
      });
      if (!checkToken) {
        throw new UnauthorizedException('Invalid Token');
      }
      const data = await this.prisma.user.findMany({
        select: {
          full_name: true,
          email: true,
          pass_word: false,
          phone: true,
          user_type: true,
        },
      });
      return { success: true, message: 'success', data };
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }

  async getFindUser(access_token: string, keyword: string) {
    try {
      const decodedToken = (await this.jwtService.decode(
        access_token.replace('Bearer ', ''),
      )) as any;
      const user_id = decodedToken?.data?.user_id;
      const checkToken = await this.prisma.user.findFirst({
        where: {
          user_id,
        },
      });
      if (!checkToken) {
        throw new UnauthorizedException('Invalid Token');
      }
      if (!keyword) {
        return { success: false, message: 'Keyword is required.' };
      }
      const data = await this.prisma.user.findMany({
        where: {
          OR: [
            {
              full_name: {
                contains: keyword,
              },
            },
            {
              email: {
                contains: keyword,
              },
            },
            {
              phone: {
                contains: keyword,
              },
            },
          ],
        },
        select: {
          full_name: true,
          email: true,
          phone: true,
        },
      });
      if (data.length > 0) {
        return { success: true, message: 'Success', data };
      } else {
        return {
          success: false,
          message: 'No users found with the given keyword.',
        };
      }
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }

  async getUserInfo(access_token: string) {
    try {
      const decodedToken = (await this.jwtService.decode(
        access_token.replace('Bearer ', ''),
      )) as any;
      const user_id = decodedToken?.data?.user_id;
      if (!user_id) {
        throw new UnauthorizedException('Invalid Token');
      }

      const data = await this.prisma.user.findFirst({
        where: { user_id },
        select: {
          user_id: true,
          email: true,
          full_name: true,
          phone: true,
          user_type: true,
          ticket: {
            select: {
              schedule_id: true,
              seat_id: true,
            },
          },
        },
      });
      return { success: true, message: 'success', data };
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }

  async getUserInfoById(access_token: string, user_id: number) {
    try {
      const decodedToken = (await this.jwtService.decode(
        access_token.replace('Bearer ', ''),
      )) as any;
      const checkUser = decodedToken?.data;
      if (!checkUser?.user_id) {
        throw new UnauthorizedException('Invalid Token');
      } else if (checkUser?.user_type !== 'admin') {
        throw new UnauthorizedException('Unauthorized');
      }
      const data = await this.prisma.user.findFirst({
        where: { user_id },
        select: {
          full_name: true,
          email: true,
          pass_word: false,
          phone: true,
          user_type: true,
          ticket: {
            select: {
              schedule_id: true,
              seat_id: true,
              schedule: true,
            },
          },
        },
      });
      if(!data) {
        throw new HttpException('User not found', 400);
      }
      return { success: true, message: 'success', data };
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }

  async postAddUser(access_token: string, newUser: CreateUserDto) {
    try {
      const decodedToken = (await this.jwtService.decode(
        access_token.replace('Bearer ', ''),
      )) as any;
      const checkUser = decodedToken?.data;
      if (!checkUser?.user_id) {
        throw new UnauthorizedException('Invalid Token');
      } else if (checkUser?.user_type !== 'admin') {
        throw new UnauthorizedException('Unauthorized');
      }
      const { full_name, email, phone, pass_word, user_type } = newUser;
      const checkEmail = await this.prisma.user.findFirst({
        where: { email },
      });
      if (checkEmail) {
        return { success: false, message: 'That email is taken. Try another.' };
      }
      const hashedPassword = await bcrypt.hashSync(pass_word, 10);
      const dataUser = await this.prisma.user.create({
        data: {
          full_name,
          email,
          phone,
          pass_word: hashedPassword,
          user_type,
        },
        select: {
          full_name: true,
          email: true,
          phone: true,
          user_type: true,
        },
      });
      return { success: true, message: 'success', newUser: dataUser };
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }

  async postUpdateUser(access_token: string, userUpdate: UpdateUserDto) {
    try {
      const decodedToken = (await this.jwtService.decode(
        access_token.replace('Bearer ', ''),
      )) as any;
      const user_id = decodedToken?.data?.user_id;
      if (!user_id) {
        throw new UnauthorizedException('Invalid Token');
      }
      const { full_name, email, phone, user_type } = userUpdate;
      const data = await this.prisma.user.update({
        where: { user_id },
        data: {
          email,
          full_name,
          phone,
          user_type,
        },
        select: {
          full_name: true,
          email: true,
          pass_word: false,
          phone: true,
          user_type: true,
        },
      });
      return { success: true, message: 'success', dataUpdated: data };
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }

  async postUpdateUserById(
    access_token: string,
    dataUpdate: UpdateUserDto,
    user_id: number,
  ) {
    try {
      const decodedToken = (await this.jwtService.decode(
        access_token.replace('Bearer ', ''),
      )) as any;
      const checkUser = decodedToken?.data;
      if (!checkUser?.user_id) {
        throw new UnauthorizedException('Invalid Token');
      } else if (checkUser?.user_type !== 'admin') {
        throw new UnauthorizedException('Unauthorized');
      }
      const { full_name, email, phone, user_type } = dataUpdate;
      const data = await this.prisma.user.update({
        where: { user_id },
        data: {
          email,
          full_name,
          phone,
          user_type,
        },
        select: {
          user_id: true,
          full_name: true,
          email: true,
          pass_word: false,
          phone: true,
          user_type: true,
        },
      });
      return { success: true, messsage: 'success', userUpdate: data };
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }

  async deleteUser(access_token: string, user_id: number) {
    const decodedToken = (await this.jwtService.decode(
      access_token.replace('Bearer ', ''),
    )) as any;
    const checkUser = decodedToken?.data;
    if (!checkUser?.user_id) {
      throw new UnauthorizedException('Invalid Token');
    } else if (checkUser?.user_type !== 'admin') {
      throw new UnauthorizedException('Unauthorized');
    }
    const checkInfo = await this.prisma.user.findUnique({
      where: {
        user_id,
      },
    });
    if (!checkInfo) {
      throw new Error('User not found!');
    }

    const deleteUserTickets = await this.prisma.ticket.deleteMany({
      where: {
        user_id,
      },
    });

    const userDelete = await this.prisma.user.delete({
      where: {
        user_id: checkInfo.user_id,
      },
    });
    return { success: true, message: 'success', userDelete };
  }
  
}
