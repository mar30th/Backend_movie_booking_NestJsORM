import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketService } from './ticket.service';
// import { CreateTicketDto } from './dto/create-ticket.dto';
// import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('booking/:user_id')
  async postTicket(@Param('user_id', ParseIntPipe) user_id: number , @Body('ticket') ticket: CreateTicketDto){
    const createdTicket = await this.ticketService.postTicket(user_id, ticket);
    return{
      message: "success",
      ticket: createdTicket
    }
  }
}