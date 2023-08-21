import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';

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
}
