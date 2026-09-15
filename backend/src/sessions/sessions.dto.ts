import { IsNumber } from 'class-validator';

export class CreateSessionDto {
  @IsNumber()
  score!: number;

  @IsNumber()
  maxWpm!: number;

  @IsNumber()
  avgWpm!: number;

  @IsNumber()
  accuracy!: number;

  @IsNumber()
  wavesReached!: number;

  @IsNumber()
  duration!: number;
}
