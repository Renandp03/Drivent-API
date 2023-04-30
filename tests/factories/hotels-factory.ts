import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: 'HotelTest',
      image: 'urlfromimage',
    },
  });
}

export async function createRoom() {
  return prisma.room.create({
    data: {
      name: faker.company.companyName(),
      capacity: 2,
      hotelId: 1,
    },
  });
}

export async function createNotCapacityRoom() {
  return prisma.room.create({
    data: {
      name: faker.company.companyName(),
      capacity: 0,
      hotelId: 1,
    },
  });
}
