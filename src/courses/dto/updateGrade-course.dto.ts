import { IsNumber, Max } from 'class-validator';

export class UpdateGradeDto {
  @IsNumber()
  @Max(100)
  grade: number;
}
