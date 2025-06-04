import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Order } from "./schemas/order.schema";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection } from "mongoose";


@Injectable()
export class OrdersRepository extends AbstractRepository<Order> {
    protected readonly logger = new Logger(OrdersRepository.name);

    constructor(
        @InjectModel(Order.name) private readonly orderModel,
        @InjectConnection() connection: Connection,
    ) {
        super(orderModel, connection);
    }

}