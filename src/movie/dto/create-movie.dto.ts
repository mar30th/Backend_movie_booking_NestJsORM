export class CreateMovieDto {
    movie_id?: number;
    name: string;
    trailer: string;
    image: string;
    description: string;
    release_date: string;
    rating: number;
    hot: boolean;
    now_showing: boolean;
    coming_soon: boolean
}
