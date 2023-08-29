import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    full_name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    pass_word: string;

    @ApiProperty()
    user_type?: string;
}

export class SignInDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    pass_word: string;
}

export class DeleteUserDto {
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    email: string;
}