import {IsInt, Min, Max} from 'class-validator'

export class GetTodosQueryDto {
  @IsInt()
  @Min(1)
  page?: number

  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number
}
