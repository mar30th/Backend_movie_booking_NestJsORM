import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserService {
  private prisma: PrismaClient;
  constructor() {
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
  
  getUserData(){
    //user token, handle later
  }
  
  
}
