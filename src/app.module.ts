import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './movie/movie.module';
import { CinemaModule } from './cinema/cinema.module';
import { TicketModule } from './ticket/ticket.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserService } from './user/user.service';

@Module({
  controllers: [AppController],
  providers: [AppService, JwtStrategy, UserService],
  imports: [
    UserModule,
    AuthModule,
    MovieModule,
    CinemaModule,
    TicketModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ secret: 'KEY', signOptions: { expiresIn: '30m' } }),
  ],
})
export class AppModule {}
