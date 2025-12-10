import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class TodoDto {
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title should not be empty' })
  @MaxLength(255, {
    message: 'title must be shorter than or equal to 255 characters',
  })
  title: string;
}