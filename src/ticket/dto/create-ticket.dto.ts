import { ApiProperty } from "@nestjs/swagger";

export class CreateTicketDto {
  @ApiProperty()
  schedule_id: number;

  @ApiProperty()
  bookingList: [
    {
      seat_id: number;
      price: number;
    },
  ];
}

export class Seat {
  @ApiProperty()
  seat_id: number;

  @ApiProperty()
  price: number;
}

export class CreateScheduleDto {
  @ApiProperty()
  movie_id: number;

  @ApiProperty()
  screen_id: number;

  @ApiProperty()
  showtime: string;

  @ApiProperty()
  price: number;
}