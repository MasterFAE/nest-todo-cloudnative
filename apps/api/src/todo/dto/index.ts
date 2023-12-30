import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be string' })
  @MaxLength(250, { message: 'Title cannot be longer than 250 characters' })
  title: string;

  @IsNotEmpty({ message: 'Canva is required' })
  @IsString({ message: 'Invalid id' })
  canvaId: string;

  @IsOptional()
  @IsString({ message: 'Content must be string' })
  @MaxLength(2500, { message: 'Content cannot be longer than 2500 characters' })
  content: string;
}

export class UpdateTodoDto {
  @IsNotEmpty({ message: 'Id is required' })
  @IsString({ message: 'Invalid id' })
  id: string;

  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be string' })
  @MaxLength(250, { message: 'Title cannot be longer than 250 characters' })
  title: string;

  @IsNotEmpty({ message: 'Canva is required' })
  @IsString({ message: 'Invalid id' })
  canvaId: string;

  @IsOptional()
  @IsString({ message: 'Content must be string' })
  @MaxLength(2500, { message: 'Content cannot be longer than 2500 characters' })
  content: string;
}

export class UpdateTodoOrderDto {
  @IsNotEmpty({ message: 'Id is required' })
  @IsString({ message: 'Invalid id' })
  id: string;

  @IsNotEmpty({ message: 'Order cannot be empty' })
  @IsNumber()
  order: number;
}
