import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  @MinLength(5)
  @IsOptional()
  title: string;

  @IsString()
  @MinLength(10)
  @IsOptional()
  description: string;
}
