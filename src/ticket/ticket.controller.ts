import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Headers,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { CreateScheduleDto, CreateTicketDto } from './dto/create-ticket.dto';
import { TicketService } from './ticket.service';
// import { CreateTicketDto } from './dto/create-ticket.dto';
// import { UpdateTicketDto } from './dto/update-ticket.dto';

@ApiTags('Ticket')
@Controller('ticket')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
  ) {}

  @Post('booking')
  async postTicket(
    @Headers('access_token') access_token: string,
    @Body() ticket: CreateTicketDto,
  ) {
    return await this.ticketService.postTicket(access_token, ticket);
  }

  @Get('seat-list/:schedule_id')
  async getSeatListByScheduleID(
    @Param('schedule_id', ParseIntPipe) schedule_id: number
  ) {
    return await this.ticketService.getSeatListByScheduleID(schedule_id)
  }

  @Post('create-schedule')
  async postSchedule(
    @Headers('access_token') access_token: string,
    @Body() schedule: CreateScheduleDto
  ){
    return this.ticketService.postSchedule(access_token, schedule)
  }
}
