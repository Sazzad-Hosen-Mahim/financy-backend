import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBookingDto): Promise<Booking> {
    return this.prisma.booking.create({ data });
  }

  async findAll(): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
