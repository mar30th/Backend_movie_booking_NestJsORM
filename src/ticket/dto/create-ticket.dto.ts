export class CreateTicketDto {
  schedule_id: number;
  bookingList: [
    {
      seat_id: number;
      price: number;
    },
  ];
}

export class Seat {
  seat_id: number;
  price: number;
}

export class CreateScheduleDto {
  movie_id: number;
  screen_id: number;
  showtime: string;
  price: number;
}