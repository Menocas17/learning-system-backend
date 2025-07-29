import {
  IsString,
  IsNumber,
  IsUUID,
  IsDateString,
  MinLength,
  Max,
  isBoolean,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  is_public: boolean;
}
