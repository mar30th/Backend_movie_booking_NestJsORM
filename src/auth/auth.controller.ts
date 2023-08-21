import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateUserDto, SignInDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() user: CreateUserDto) {
    return this.authService.signUp(user)
  }

  @Post('/login')
  async signIn(@Body() user: SignInDto) {
    return this.authService.signIn(user)
  }
}
