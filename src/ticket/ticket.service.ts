import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // POST book ticket
  async postTicket(user_id: number, ticket: CreateTicketDto){
    const {schedule_id, bookingList} = ticket;    
    const createdTicket: Ticket[] = [];

    for (const booking of bookingList){
      const {seat_id, price} = booking;

      const newTicket = await this.prisma.ticket.create({
        data: {
          user_id,
          schedule_id,
          seat_id,
        }
      });

      createdTicket.push(newTicket);
    }

    return createdTicket;
  }
}
