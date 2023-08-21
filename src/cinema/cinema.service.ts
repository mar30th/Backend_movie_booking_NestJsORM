import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';

@Injectable()
export class CinemaService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Get Cinema Systems
  async getCinemaSystemsList() {
    const data = await this.prisma.cinema_systems.findMany();
    return { success: true, message: 'success', data };
  }

  // Get Find Cinema Systems By Name
  async getCinemaSystemsByName(keyword: string) {
    const data = await this.prisma.cinema_systems.findMany({
      where: {
        cinema_systems_name: {
          contains: keyword,
        },
      },
    });
    if (data.length > 0) {
      return { success: true, message: 'success', data };
    }
    return {
      success: false,
      message: "Can't find cinema systems with this keyword",
    };
  }

  // Get Cinema by Cinema Systems
  async getCinemaBySystems(cinema_systems_id: number) {
    const data = await this.prisma.cinema.findMany({
      where: {
        cinema_systems_id,
      },
      select: {
        cinema_systems_id: true,
        cinema_name: true,
        address: true,
        screen: true,
      },
    });
    return { success: true, message: 'success', data };
  }

  // Get schedule by Cinema
  async getScheduleByCinemaId(cinema_systems_id: number) {
    const cinemaSystems = await this.prisma.cinema_systems.findMany({
      where: {
        cinema_systems_id,
      },
      include: {
        cinema: {
          include: {
            screen: {
              include: {
                schedule: {
                  include: {
                    movie: {
                      select: {
                        movie_id: true,
                        name: true,
                        image: true,
                        hot: true,
                        now_showing: true,
                        coming_soon: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  
    if (!cinemaSystems || cinemaSystems.length === 0) {
      return { statusCode: 404, message: 'Cinema systems not exist' };
    }
  
    const content = cinemaSystems.map(cinemaSystem => ({
      lstCinema: cinemaSystem.cinema.map(cinema => ({
        danhSachPhim: cinema.screen.map(screen => ({
          // lstLichChieuTheoPhim: screen.schedule.map(schedule => ({
          //   maLichChieu: schedule.maLichChieu,
          //   maRap: schedule.maRap,
          //   tenRap: schedule.tenRap,
          //   ngayChieuGioChieu: schedule.ngayChieuGioChieu,
          //   giaVe: schedule.giaVe,
          // })),
          // maPhim: screen.movie.maPhim,
          // tenPhim: screen.movie.tenPhim,
          // hinhAnh: screen.movie.hinhAnh,
          // hot: screen.movie.hot,
          // dangChieu: screen.movie.dangChieu,
          // sapChieu: screen.movie.sapChieu,
        })),
      })),
    }));
  
    return { statusCode: 200, message: 'Xử lý thành công!', content };
  }
  
}
