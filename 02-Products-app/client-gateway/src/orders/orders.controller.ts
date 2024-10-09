import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';

import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDERS_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto, OrderPaginationDTO, StatusDto } from './dto';
import { PaginationDto } from 'src/commons';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const newProduct = await firstValueFrom(
        this.ordersClient.send('createOrder', createOrderDto),
      );
      return newProduct;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async findAll(@Query() orderPaginationDTO: OrderPaginationDTO) {
    try {
      const newProduct = await firstValueFrom(
        this.ordersClient.send('findAllOrders', orderPaginationDTO),
      );
      return newProduct;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.ordersClient.send('findOneOrder', { id }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDTO: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      const newProduct = await firstValueFrom(
        this.ordersClient.send('findAllOrders', {
          ...paginationDto,
          status: statusDTO.status,
        }),
      );
      return newProduct;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      const newProduct = await firstValueFrom(
        this.ordersClient.send('changeOrderStatus', {
          ...statusDto,
        }),
      );
      return newProduct;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
