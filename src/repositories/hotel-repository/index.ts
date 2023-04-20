import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function payedTicketUser(id: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId: id,
    },
    include: {
      Enrollment: true,
    },
  });
}

const hotelRepository = { findHotels };

export default hotelRepository;
