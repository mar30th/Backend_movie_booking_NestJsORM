import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Get banner list
  async getBanner() {
    const data = await this.prisma.banner.findMany();
    return { success: true, message: 'success', data };
  }

  // Get find movie list
  async getMovieByName(keyword: string) {
    const data = await this.prisma.movie.findMany({
      where: {
        name: {
          contains: keyword,
        },
      },
    });
    return { success: true, message: 'success', data };
  }

  // Get Movie Info
  async getMovieById(movie_id: number){
    const checkMovie = await this.prisma.movie.findFirst({
      where: {
        movie_id,
      }
    })
    if(!checkMovie){
      return { success: false, message: 'Movie not Found' };
    } return {success: true, message: "Success", data: checkMovie}
  }

  // Post add movie
  async postMovie(movie: CreateMovieDto) {
    let { ...newMovie } = movie;
    const checkMovie = await this.prisma.movie.findFirst({
      where: {
        name: newMovie.name,
      },
    });
    if (!checkMovie) {
      const data = await this.prisma.movie.create({
        data: {
          name: newMovie.name,
          trailer: newMovie.trailer,
          image: newMovie.image,
          description: newMovie.description,
          release_date: newMovie.release_date,
          rating: newMovie.rating,
          hot: newMovie.hot,
          now_showing: newMovie.now_showing,
          coming_soon: newMovie.coming_soon,
        },
      });
      return { success: true, message: 'success', data };
    }
    return { success: false, message: 'Movie already exits!' };
  }

  //Post update movie
  async postUpdateMovie(dataUpdate: UpdateMovieDto) {
    let { ...data } = dataUpdate;
    const checkMovie = await this.prisma.movie.findFirst({
      where: {
        movie_id: data.movie_id,
      },
    });
    if (!checkMovie) {
      return { success: false, message: 'Movie not Found' };
    }
    const dataUpdated = await this.prisma.movie.update({
      where: {
        movie_id: data.movie_id,
      },
      data: {
        name: data?.name,
        trailer: data?.trailer,
        image: data?.image,
        description: data?.description,
        release_date: data?.release_date,
        rating: data?.rating,
        hot: data?.hot,
        now_showing: data?.now_showing,
        coming_soon: data?.coming_soon,
      },
    });
    return { success: true, message: 'success', dataUpdated };
  }

  //Delete movie
  async deleteMovie(movie_id: number) {
    const checkMovie = await this.prisma.movie.findFirst({
      where: {
        movie_id
      }
    })
    if(!checkMovie){
      return { success: false, message: 'Movie not Found' };
    }
    const data = await this.prisma.movie.delete({
      where: {
        movie_id
      }
    })
    return {success: true, messaga: "Movie delete success", data}
  }

}
