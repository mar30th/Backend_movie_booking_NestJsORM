import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

@Get('/banner')
async getBanner() {
  return this.movieService.getBanner();
}

@Get('/name/:keyword?')
async getMovieByName(@Param('keyword') keyword?: string){
  return this.movieService.getMovieByName(keyword);
}

@Get('/movie-id/:movie_id')
async getMovieById(@Param('movie_id', ParseIntPipe) movie_id: number) {
  return this.movieService.getMovieById(movie_id);
}

@Post('/post-movie')
async postMovie(@Body() movie: CreateMovieDto){
  return this.movieService.postMovie(movie)
}

@Post('/update-movie')
async postUpdateMovie(@Body() dataUpdate: UpdateMovieDto) {
  return this.movieService.postUpdateMovie(dataUpdate)
}

@Delete('/delete-movie/:movie_id')
async deleteMovie(@Param('movie_id', ParseIntPipe) movie_id: number){
  return this.movieService.deleteMovie(movie_id);
}
}
