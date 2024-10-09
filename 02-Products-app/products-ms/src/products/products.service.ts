import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/commons/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService');
  onModuleInit() {
    this.$connect();
    this.logger.log('Database connect');
  }
  async create(createProductDto: CreateProductDto) {
    const existProduct = await this.product.findFirst({
      where: { name: createProductDto.name },
    });
    if (existProduct) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: 'Product exist',
      });
    }
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;

    const totalPage = await this.product.count();

    const lastPage = Math.ceil(totalPage / limit);

    return {
      data: await this.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: { available: true },
      }),
      meta: {
        page: page,
        total: totalPage,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    let productExist = await this.product.findUnique({
      where: {
        id: id,
        available: true,
      },
    });
    if (!productExist) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'No exist product',
      });
    }
    return productExist;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;
    const existProduct = await this.product.findFirst({
      where: { name: data.name },
    });

    if (!existProduct) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'Product  not exist',
      });
    }
    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const product = await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });

    return product;
  }

  async validateProduct(ids: number[]) {
    ids = Array.from(new Set(ids));
    const products = await this.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (products.length !== ids.length) {
      throw new RpcException({
        message: 'Some product were not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return products;
  }
}
