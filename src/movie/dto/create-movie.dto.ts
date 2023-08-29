import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty()
  movie_id?: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  trailer: string;
  @ApiProperty()
  image: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  release_date: string;
  @ApiProperty()
  rating: number;
  @ApiProperty()
  hot: boolean;
  @ApiProperty()
  now_showing: boolean;
  @ApiProperty()
  coming_soon: boolean;
}
