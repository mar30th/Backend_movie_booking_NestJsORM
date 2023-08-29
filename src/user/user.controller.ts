import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, DeleteUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-user-type')
  getUser(@Headers('access_token') access_token: string){
    return this.userService.getUserType(access_token);
  }

  @Get('get-user-list')
  getUserList(@Headers ('access_token') access_token: string) {
    return this.userService.getUser(access_token);
  }

  @Get('find-user/:keyword')
  getFindUser(@Headers('access_token') access_token: string, @Param('keyword') keyword: string){
    return this.userService.getFindUser(access_token, keyword);
  }

  @Get('get-info')
  async getUserInfo(@Headers('access_token') access_token: string) {
    return this.userService.getUserInfo(access_token)
  }
// 
  @Get('/admin/get-info/:user_id')
  async getUserInfoById(@Headers('access_token') access_token: string, @Param('user_id', ParseIntPipe) user_id: number) {
    return this.userService.getUserInfoById(access_token, user_id)
  }

  @Post('admin/add-user')
  async postAddUser(@Headers('access_token') access_token: string, @Body() newUser: CreateUserDto) {
    return this.userService.postAddUser(access_token, newUser)
  }

  @Post('/user-update')
  async postUpdateUser(@Headers('access_token') access_token: string, @Body() dataUpdate: UpdateUserDto){
    return this.userService.postUpdateUser(access_token, dataUpdate)
  }

  @Post('admin/update-user/:user_id')
  async postUpdateUserById(@Headers('access_token') access_token: string, @Param('user_id', ParseIntPipe) user_id: number, @Body() dataUpdate: UpdateUserDto) {
    return this.userService.postUpdateUserById(access_token, dataUpdate, user_id)
  }

  @Delete('admin/delete-user/:user_id')
  async deleteUser(@Headers('access_token') access_token: string, @Param('user_id', ParseIntPipe) user_id: number) {
    return this.userService.deleteUser(access_token, user_id)
  }
}
