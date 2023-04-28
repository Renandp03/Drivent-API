import { prisma } from '@/config';

async function getBook(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
  });
}

const bookingRepository = { getBook };

export default bookingRepository;
