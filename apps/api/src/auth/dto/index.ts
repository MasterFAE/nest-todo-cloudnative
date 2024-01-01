import { Transform } from 'class-transformer';
import { IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
