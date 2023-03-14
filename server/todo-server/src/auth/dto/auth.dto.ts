import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  login: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
