import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  private prisma: PrismaClient;
  constructor(private readonly jwtService: JwtService) {
    this.prisma = new PrismaClient();
  }

  // Get banner list
  async getBanner() {
    try {
      const data = await this.prisma.banner.findMany();
      return { success: true, message: 'success', data };
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }

  // Get Movie List
  async getMovieList() {
    try {
      const data = await this.prisma.movie.findMany();
      return { success: true, message: 'success', data };
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }

  // Get find movie by name
  async getMovieByName(keyword: string) {
    try {
      const data = await this.prisma.movie.findMany({
        where: {
          name: {
            contains: keyword,
          },
        },
      });
      return { success: true, message: 'success', data };
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }

  // Get Movie Info by id
  async getMovieById(movie_id: number) {
    const checkMovie = await this.prisma.movie.findFirst({
      where: {
        movie_id,
      },
    });
    if (!checkMovie) {
      return { success: false, message: 'Movie not Found' };
    }
    return { success: true, message: 'Success', data: checkMovie };
  }

  // Post add movie
  async postMovie(
    access_token: string,
    movie: CreateMovieDto,
    imgFile: Express.Multer.File,
  ) {
    try {
      const decodedToken = (await this.jwtService.decode(
        access_token.replace('Bearer ', ''),
      )) as any;
      const checkUser = decodedToken?.data;
      if (!checkUser?.user_id) {
        throw new UnauthorizedException('Invalid Token');
      } else if (checkUser?.user_type !== 'admin') {
        throw new UnauthorizedException('Unauthorized');
      }
      let { ...newMovie } = movie;
      let image = '/public/movie.img/' + imgFile.filename;
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
            image,
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
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }

  //Post update movie
  async postUpdateMovie(
    access_token: string,
    dataUpdate?: UpdateMovieDto,
    imgFile?: Express.Multer.File,
  ) {
    try {
      const decodedToken = (await this.jwtService.decode(
        access_token.replace('Bearer ', ''),
      )) as any;
      const checkUser = decodedToken?.data;
      if (!checkUser?.user_id) {
        throw new UnauthorizedException('Invalid Token');
      } else if (checkUser?.user_type !== 'admin') {
        throw new UnauthorizedException('Unauthorized');
      }
      let { ...data } = dataUpdate;
      let image = 'public/movie.img/' + imgFile.filename;
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
          image,
          description: data?.description,
          release_date: data?.release_date,
          rating: data?.rating,
          hot: data?.hot,
          now_showing: data?.now_showing,
          coming_soon: data?.coming_soon,
        },
      });
      return { success: true, message: 'success', dataUpdated };
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }

  //Delete movie
  async deleteMovie(access_token: string, movie_id: number) {
    try {
      const decodedToken = (await this.jwtService.decode(
        access_token.replace('Bearer ', ''),
      )) as any;
      const checkUser = decodedToken?.data;
      if (!checkUser?.user_id) {
        throw new UnauthorizedException('Invalid Token');
      } else if (checkUser?.user_type !== 'admin') {
        throw new UnauthorizedException('Unauthorized');
      }
      const checkMovie = await this.prisma.movie.findFirst({
        where: {
          movie_id,
        },
      });
      if (!checkMovie) {
        return { success: false, message: 'Movie not Found' };
      }
      const data = await this.prisma.movie.delete({
        where: {
          movie_id,
        },
      });
      return { success: true, messaga: 'Movie delete success', data };
    } catch (err) {
      throw new HttpException('Failed', 400);
    }
  }
}
