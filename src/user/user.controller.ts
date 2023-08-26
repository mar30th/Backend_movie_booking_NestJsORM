import { Controller, Get, Headers, Param, ParseIntPipe } from '@nestjs/common';
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

  @Get('get-infomation')
  async getUserInfo(@Headers('access_token') access_token: string) {
    return this.userService.getUserInfo(access_token)
  }

  @Get('get-user-infomation/:user_id')
  async getUserInfoById(@Headers('access_token') access_token: string, @Param('user_id', ParseIntPipe) user_id: number) {
    return this.userService.getUserInfoById(access_token, user_id)
  }

}
