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

  // Get Cinema Systems Info
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

  // Get Cinema by Cinema Systems Id
  async getCinemaBySystems(cinema_systems_id: number) {
    const data = await this.prisma.cinema.findMany({
      where: {
        cinema_systems_id,
      },
      select: {
        cinema_id: true,
        cinema_name: true,
        address: true,
        screen: true,
      },
    });
    return { success: true, message: 'success', data };
  }

  // Get schedule by Cinema
  async getScheduleByCinemaSystemsId(cinema_systems_id: number) {
    const checkSchedule = await this.prisma.schedule.findMany({
      where: {
        screen: {
          cinema: {
            cinema_systems_id,
          },
        },
      },
      include: {
        screen: {
          include: {
            cinema: {
              include: {
                cinema_systems: true,
              },
            },
          },
        },
        movie: true,
      },
    });
    const content = checkSchedule.map((schedule) => ({
      cinemaLst: [
        {
          movieLst: [
            {
              movieSchedule: [
                {
                  scheduleId: schedule.schedule_id,
                  screenId: schedule.screen_id,
                  screenName: schedule.screen.screen_name,
                  showtime: schedule.showtime,
                  price: schedule.price,
                },
              ],
              movieId: schedule.movie.movie_id,
              movieName: schedule.movie.name,
              image: schedule.movie.image,
              hot: schedule.movie.hot,
              nowShowing: schedule.movie.now_showing,
              comingSoon: schedule.movie.coming_soon,
            },
          ],
          cinemaId: schedule.screen.cinema.cinema_id,
          cinemaName: schedule.screen.cinema.cinema_name,
          Address: schedule.screen.cinema.address,
        },
      ],
      cinemaSystemID: schedule.screen.cinema.cinema_systems.cinema_systems_id,
      cinemaSystemName:
        schedule.screen.cinema.cinema_systems.cinema_systems_name,
      cinemaSystemLogo: schedule.screen.cinema.cinema_systems.logo,
    }));

    return { success: true, message: 'success', content };
  }

  // Get Schedule By Movie ID
  async getScheduleByMovieId(movie_id: number) {
    const checkSchedule = await this.prisma.schedule.findMany({
      where: {
        movie_id,
      },
      include: {
        screen: {
          include: {
            cinema: {
              include: {
                cinema_systems: true,
              },
            },
          },
        },
        movie: true,
      },
    });

    const movieInfo = await this.prisma.movie.findFirst({
      where: {
        movie_id,
      },
    });

    const cinemaSystem = checkSchedule.map((schedule) => {
      const scheduleData = {
        cinemaLst: [
          {
            schedule: [
              {
                scheduleId: schedule.schedule_id,
                screenId: schedule.screen.screen_id,
                screenName: schedule.screen.screen_name,
                showtime: schedule.showtime,
                price: schedule.price,
              },
            ],
            cinemaId: schedule.screen.cinema.cinema_id,
            cinemaName: schedule.screen.cinema.cinema_name,
            address: schedule.screen.cinema.address,
          },
        ],
        cinemaSystemId: schedule.screen.cinema.cinema_systems.cinema_systems_id,
        cinemaSystemName:
          schedule.screen.cinema.cinema_systems.cinema_systems_name,
        logo: schedule.screen.cinema.cinema_systems.logo,
      };
      return {
        ...scheduleData,
      };
    });
    return {
      success: true,
      message: 'success',
      content: { cinemaSystem, movieInfo },
    };
  }
}
