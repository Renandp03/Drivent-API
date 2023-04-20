import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function payedTicketUser(id: number) {
  return prisma.enrollment.findFirst({
    where: {
      id,
    },
    include: {
      Ticket: {
        where: { status: 'PAID' },
      },
    },
  });
}

async function findRoomsFromHotel(id: number) {
  return prisma.hotel.findMany({
    where: {
      id,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelRepository = { findHotels, payedTicketUser, findRoomsFromHotel };

export default hotelRepository;
