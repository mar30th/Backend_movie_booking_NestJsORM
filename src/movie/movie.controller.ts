import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile, Headers } from '@nestjs/common';
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

@Get('/movie-list')
async getMovieLst() {
  return this.movieService.getMovieList();
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
async postMovie(@Headers('access_token') access_token: string, @Body() movie: CreateMovieDto, @UploadedFile() imgFile: Express.Multer.File){
  typeof movie.rating === 'string'? movie.rating = parseInt(movie.rating) : movie.rating
  
  return this.movieService.postMovie(access_token, movie, imgFile)
}

@Post('/update-movie')
async postUpdateMovie(@Headers('access_token') access_token: string, @Body() dataUpdate: UpdateMovieDto) {
  return this.movieService.postUpdateMovie(access_token, dataUpdate)
}

@Delete('/delete-movie/:movie_id')
async deleteMovie(@Headers('access_token') access_token: string, @Param('movie_id', ParseIntPipe) movie_id: number){
  return this.movieService.deleteMovie(access_token, movie_id);
}
}
