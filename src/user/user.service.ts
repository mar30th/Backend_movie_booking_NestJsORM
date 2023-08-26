import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UserService {
  private prisma: PrismaClient;
  constructor(private readonly jwtService: JwtService) {
    this.prisma = new PrismaClient();
  }

  async getUserType() {
    return this.prisma.user.findMany({
      select: {
        user_type: true,
      }
    }).then(data => {
      const enhancedData = data.map(item => {
        let type_name = "";
        switch (item.user_type) {
          case "Regular":
            type_name = "Normal";
            break;
          case "Admin":
            type_name = "Admin";
            break;
          // Add more cases for other user_type values if needed
          default:
            type_name = "Unknown";
        }
        return {
          user_type: item.user_type,
          type_name: type_name,
        };
      });
      return enhancedData;
    });
  }

  getUser() {
    return this.prisma.user.findMany();
  }

  async getFindUser(keyword: string) {
    if (!keyword) {
      return { message: "Keyword is required." };
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
      }
    });
  
    if (data.length > 0) {
      return { message: "Success", data };
    } else {
      return { message: "No users found with the given keyword." };
    }
  }
  
  async getUserInfo(access_token: string){
    const decodedToken = this.jwtService.decode(
      access_token.replace('Bearer ', ''),
    ) as any;
    const user_id = decodedToken?.data?.user_id;
    if (!user_id) {
      throw new UnauthorizedException('Invalid Token');
    };
   
    const data = await this.prisma.user.findFirst({
      where: {user_id},
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
          }
        }
      }
    })
    return {success: true, message: "success", data}
  }

  async getUserInfoById(access_token: string, user_id: number){
    const decodedToken = await this.jwtService.decode(
      access_token.replace('Bearer ', '')
    ) as any
    const checkType = decodedToken?.data?.user_type;
    if(checkType !== "Admin"){
      throw new UnauthorizedException("Unauthorized");
    } 
    const data = await this.prisma.user.findFirst({
      where: {user_id}
    })
    return {success: true, message: "success", data}
  }

  async postAddUser(access_token: string, newUser: CreateUserDto) {
    const decodedToken = await this.jwtService.decode(
      access_token.replace('Bearer ', '')
    ) as any
    const checkAccess = decodedToken?.data?.user_type;
    if(checkAccess !== "Admin"){
      throw new UnauthorizedException("Unauthorized");
    }
    const {full_name, email, phone, pass_word, user_type} = newUser
    const checkUser = await this.prisma.user.findFirst({
      where: {email}
    })
    if(checkUser){
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
        user_type: true
      }
    });
    return {success: true, message: "success", dataUser}
  }

  async postUpdateUser (access_token: string, userUpdate: UpdateUserDto) {
    const decodedToken = await this.jwtService.decode(
      access_token.replace('Bearer ', '')
    ) as any
    const user_id = decodedToken?.data?.user_id;
    if(!user_id){
      throw new UnauthorizedException('Invalid Token');
    }

    const {full_name, email, phone, pass_word, user_type} = userUpdate
    const hashedPassword = bcrypt.hashedPassword(pass_word, 10)
    const data = await this.prisma.user.update({
      where: {user_id}, data: {
        email,
        full_name,
        phone,
        pass_word: hashedPassword,
        user_type,
      }
    })
  }

  async postUpdateUserAdmin (access_token: string, userUpdate: UpdateUserDto) {
    const decodedToken = await this.jwtService.decode(
      access_token.replace('Bearer ', '')
    ) as any
    const user_id = decodedToken?.data?.user_id;
    if(!user_id){
      throw new UnauthorizedException('Invalid Token');
    }

    const checkAccess = decodedToken?.data?.user_type;
    if(checkAccess !== "Admin"){
      throw new UnauthorizedException("Unauthorized");
    }

    const {full_name, email, phone, pass_word, user_type} = userUpdate
    const hashedPassword = bcrypt.hashedPassword(pass_word, 10)
    const data = await this.prisma.user.update({
      where: {user_id}, data: {
        email,
        full_name,
        phone,
        pass_word: hashedPassword,
        user_type,
      }
    })
  }

  async deleteUser (access_token: string, user_id: number) {
    const decodedToken = await this.jwtService.decode(
      access_token.replace('Bearer ', '')
    ) as any
    const checkUser = decodedToken?.data?.user_id;
    if(!checkUser){
      throw new UnauthorizedException('Invalid Token');
    }
    const checkAccess = decodedToken?.data?.user_type;
    if(checkAccess !== "Admin"){
      throw new UnauthorizedException("Unauthorized");
    }
    const userDelete = await this.prisma.user.delete({
      where: {
        user_id
      }
    })
    return {success: true, message: "success", userDelete}
  }

  
}
