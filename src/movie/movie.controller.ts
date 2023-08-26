import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MovieService } from './movie.service';
import { diskStorage } from 'multer';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';


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


@UseInterceptors(FileInterceptor("movie_img", {
  storage: diskStorage({
    destination: process.cwd() + "/public/movie.img",
    filename: (req, file, callback) => callback(null, new Date().getTime() + file.originalname)
  })
}))
@Post('/post-movie')
async postMovie(@Body() movie: CreateMovieDto, @UploadedFile() imgFile: Express.Multer.File){
  return this.movieService.postMovie(movie, imgFile)
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
