import { ApiProperty } from "@nestjs/swagger";
import { CreateMovieDto } from "./create-movie.dto";

export class FileUploadDto {
    @ApiProperty({
        type: "string",
        format: "binary"
    }) movie_img: Express.Multer.File;
}