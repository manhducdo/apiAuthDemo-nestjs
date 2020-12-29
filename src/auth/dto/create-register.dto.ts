export class CreateUserDto {
    readonly username: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly phone: string;
    password: string | unknown;
}
  