import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequest } from './dto/create-order.request';
import { JwtAuthGuard } from '@app/common';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body() request: CreateOrderRequest,
    @Req() req: any, // Assuming you want to access the request object, you can use it as needed
  ) {
    console.log('Request user:', req.user); // Log the user information from the request
    return this.ordersService.createOrder(request);
  }

  @Get()
  async getOrders() {
    return this.ordersService.getOrders();
  }
}
