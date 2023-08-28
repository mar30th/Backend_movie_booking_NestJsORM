export class CreateUserDto {
    full_name: string;
    email: string;
    phone: string;
    pass_word: string;
    user_type?: string;
}

export class SignInDto {
    email: string;
    pass_word: string
}

export class DeleteUserDto {
    user_id: number;
    email: string;
}