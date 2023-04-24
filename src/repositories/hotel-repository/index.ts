import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function userPaidTicket(id: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId: id,
      status: 'PAID',
    },
    include: {
      TicketType: {
        select: {
          isRemote: true,
          includesHotel: true,
        },
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

const hotelRepository = { findHotels, userPaidTicket, findRoomsFromHotel };

export default hotelRepository;
