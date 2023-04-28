import { prisma } from '@/config';

async function findBook(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
  });
}

const bookingRepository = { findBook };

export default bookingRepository;
