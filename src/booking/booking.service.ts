import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService,
    private emailService: EmailService) {}

  async create(data: CreateBookingDto): Promise<Booking> {
   const booking = await this.prisma.booking.create({ data });

    // Send confirmation email after booking
    if (booking.email) {
      console.log('Sending email to:', booking.email);
await this.emailService.sendBookingConfirmationEmail(booking.email);

    }

    return booking;
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.booking.count(),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async delete(id: number): Promise<Booking> {
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
