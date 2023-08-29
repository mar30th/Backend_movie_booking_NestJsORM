import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, SignInDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';


@ApiTags('Auth')
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
