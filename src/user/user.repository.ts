import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import {
  User,
  Prisma
} from '../../node_modules/.prisma/main-client';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async countByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<number> {
    return this.prismaService.user.count({
      where: {
        OR: [{ email }, { username }],
      },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data });
  }

  async findByEmailOrUsername(identifier: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
  }

  // async updateLastLogin(userId: number): Promise < void > {
  //   await this.prismaService.user.update({
  // where: {
  //     id: 1
  //   },
  //   data: {
  //     username: 'newusername',
  //     email: 'newemail@example.com',
  //     // kolom lain yang ingin diupdate
  //   },
  // });
  // }

  async findAllWithPagination(
    search: string | undefined,
    page: number,
    limit: number,
  ): Promise<User[] | []> {
    let where;
    if (search)
      where = {
        OR: [
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            username: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            fullname: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      };
    else where = {};

    return this.prismaService.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async countSearch(search: string | undefined): Promise<number> {
    let where;
    if (search)
      where = {
        OR: [
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            username: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            fullname: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      };
    else where = {};

    return this.prismaService.user.count({ where });
  }

  async findById(id: number): Promise < User | null > {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  async countById(id: number): Promise < number > {
    return this.prismaService.user.count({ where: { id } });
  }

  async countByEmail(id: number, email: string): Promise < number > {
    return this.prismaService.user.count({
      where: { NOT: { id }, email },
    });
  }

  async countByUsername(id: number, username: string): Promise < number > {
    return this.prismaService.user.count({
      where: { NOT: { id }, username },
    });
  }

  async updateById(id: number, data: Partial < User > ): Promise < User > {
      return this.prismaService.user.update({
        where: {
          id
        },
        data,
      });
  }
}
