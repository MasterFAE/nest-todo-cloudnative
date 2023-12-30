import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCanvaDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be string' })
  @MaxLength(250, { message: 'Name cannot be longer than 250 characters' })
  name: string;
}

export class UpdateCanvaDto {
  @IsNotEmpty({ message: 'Id is required' })
  @IsString({ message: 'Invalid id' })
  id: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be string' })
  @MaxLength(250, { message: 'Name cannot be longer than 250 characters' })
  name: string;
}
