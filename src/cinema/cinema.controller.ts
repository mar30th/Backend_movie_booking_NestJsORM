import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CinemaService } from './cinema.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';

@ApiTags('Cinema')
@Controller('cinema')
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}

  @Get('/cinema-systems')
  async getCinemaSystemsList(){
    return this.cinemaService.getCinemaSystemsList();
  }

  @Get('/cinema-systems/:keyword?')
  async getCinemaSystemsByName(@Param('keyword') keyword: string){
    return this.cinemaService.getCinemaSystemsByName(keyword);
  }   
  
  @Get('/cinox/:cinema_systems_id')
  async getCinemaBySystems(@Param('cinema_systems_id', ParseIntPipe) cinema_systems_id: number){
    return this.cinemaService.getCinemaBySystems(cinema_systems_id)
  }

  @Get('schedule/cinema-systems_id/:cinema_systems_id')
  async getScheduleByCinemaSystemsId(@Param('cinema_systems_id', ParseIntPipe) cinema_systems_id: number){
    return this.cinemaService.getScheduleByCinemaSystemsId(cinema_systems_id)
  }

  @Get('schedule/movie-id/:movie_id')
  async getScheduleByMovieId(@Param('movie_id', ParseIntPipe) movie_id: number){
    return this.cinemaService.getScheduleByMovieId(movie_id)
  }
}
