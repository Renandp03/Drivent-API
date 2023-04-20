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

const hotelRepository = { findHotels, payedTicketUser };

export default hotelRepository;
