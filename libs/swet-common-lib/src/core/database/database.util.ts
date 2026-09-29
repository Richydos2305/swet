import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginatedResponse } from '../api/interface/paginated-response.interface';

@Injectable()
export class DatabaseUtil {
  /**
   * Maps a plain object (entity) to a class instance (DTO)
   * using class-transformer's plainToInstance.
   */
  static mapEntityToDTO<Entity, DTO>(
    entity: Entity,
    dtoClass: new () => DTO,
  ): DTO {
    return plainToInstance(dtoClass, entity, { excludeExtraneousValues: true });
  }

  static getPaginatedResponse<T>(
    content: T[],
    page: number,
    limit: number,
    totalCount: number,
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const currentPage = page > totalPages ? totalPages : page;

    return {
      content: content || [],
      currentPage,
      totalPages: totalPages || 1,
      firstPage: currentPage === 1,
      lastPage: currentPage >= totalPages,
      totalCount: Number(totalCount),
    };
  }

  static getOffset(page: number, limit: number): number {
    if (page < 1) page = 1;
    return (page - 1) * limit;
  }

  /**
   * Extracts the string values of a TypeScript enum for use with Drizzle's
   * `pgEnum`, which requires a non-empty tuple `[string, ...string[]]`.
   *
   * @example
   * ```ts
   * export const genderPgEnum = pgEnum('gender', DatabaseUtil.enumValues(Gender));
   * ```
   */
  static enumValues<T extends Record<string, string>>(
    enumObj: T,
  ): [string, ...string[]] {
    return Object.values(enumObj) as [string, ...string[]];
  }
}
