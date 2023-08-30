import {
  ConflictException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { CreateScheduleDto, CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketService {
  private prisma: PrismaClient;

  constructor(private readonly jwtService: JwtService) {
    this.prisma = new PrismaClient();
  }

  // POST book ticket
  async postTicket(access_token: string, ticket: CreateTicketDto) {
    try {
      const { schedule_id, bookingList } = ticket;
      const decodedToken = this.jwtService.decode(
        access_token.replace('Bearer ', ''),
      ) as any;
      const user_id = decodedToken?.data?.user_id;
      if (!user_id) {
        throw new UnauthorizedException('Invalid Token');
      }
      const checkSchedule = await this.prisma.schedule.findFirst({
        where: { schedule_id },
      });
      if (!checkSchedule) {
        throw new Error('Movie Schedule not found!');
      }
      const ticketRecord: Ticket[] = [];
      for (let booking of ticket.bookingList) {
        const { seat_id } = booking;
        const checkSeat = await this.prisma.ticket.findUnique({
          where: {
            user_id_schedule_id: {
              user_id: user_id,
              schedule_id: schedule_id,
            },
            seat_id: seat_id,
          },
        });
        if (checkSeat) {
          throw new ConflictException('Seat is already taken');
        }
        const createTicket = await this.prisma.ticket.create({
          data: {
            user_id,
            schedule_id,
            seat_id,
          },
        });
        ticketRecord.push(createTicket);
      }
      return { success: true, message: 'success', data: ticketRecord };
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }

  async getSeatListByScheduleID(schedule_id: number) {
    try {
      const schedule = await this.prisma.schedule.findFirst({
        where: { schedule_id },
      });
      if (!schedule) {
        throw new Error('Movie Schedule not found!');
      }
      const { movie_id, screen_id } = schedule;
      const movieInfo = await this.prisma.movie.findFirst({
        where: { movie_id },
      });
      const seatInfo = await this.prisma.seat.findMany({
        where: { screen_id },
      });
      return {
        success: true,
        message: 'success',
        data: { movieInfo, seatInfo },
      };
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }

  async postSchedule(access_token: string, schedule: CreateScheduleDto) {
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
      const { movie_id, price, screen_id, showtime } = schedule;
      const checkMovie = await this.prisma.movie.findFirst({
        where: { movie_id },
      });
      if (!checkMovie) {
        throw new Error('Movie not found!');
      }
      const checkScreen = await this.prisma.screen.findFirst({
        where: { screen_id },
      });
      if (!checkScreen) {
        throw new Error('Screen not found!');
      }
      const newSchedule = await this.prisma.schedule.create({
        data: {
          movie: { connect: { movie_id } },
          screen: { connect: { screen_id } },
          showtime,
          price,
        },
      });
      return { success: true, message: 'success', data: newSchedule };
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }
}
