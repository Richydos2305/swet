import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  totalPages: number;
  firstPage: boolean;
  lastPage: boolean;
  totalCount: number;
}

export function PaginatedResponseDTO<T>(
  ItemClass: Type<T>,
): Type<PaginatedResponse<T>> {
  class PaginatedResponseClass {
    @ApiProperty({ type: [ItemClass] })
    content: T[];

    @ApiProperty()
    currentPage: number;

    @ApiProperty()
    totalPages: number;

    @ApiProperty()
    firstPage: boolean;

    @ApiProperty()
    lastPage: boolean;

    @ApiProperty()
    totalCount: number;
  }

  Object.defineProperty(PaginatedResponseClass, 'name', {
    value: `Paginated${ItemClass.name}`,
  });

  return PaginatedResponseClass;
}
