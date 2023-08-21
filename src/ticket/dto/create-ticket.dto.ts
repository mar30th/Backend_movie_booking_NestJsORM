export class CreateTicketDto {
    schedule_id: number;
    bookingList: {
      seat_id: number;
      price: number;
    }[];
  }
  