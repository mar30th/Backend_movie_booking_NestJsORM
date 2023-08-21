import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user-type')
  getUser(){
    return this.userService.getUserType();
  }

  @Get('user-list')
  getUserList() {
    return this.userService.getUser();
  }

  @Get('find-user/:keyword')
  getFindUser(@Param('keyword') keyword: string){
    return this.userService.getFindUser(keyword);
  }
}
