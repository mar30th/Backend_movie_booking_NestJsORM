import { ApiProperty } from "@nestjs/swagger";

class Booking {
  @ApiProperty()
  seat_id: number;

  @ApiProperty()
  price: number;
}

export class CreateTicketDto {
  @ApiProperty()
  schedule_id: number;

  @ApiProperty({ type: [Booking] }) // Định rõ kiểu dữ liệu là một mảng Booking
  bookingList: Booking[];
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