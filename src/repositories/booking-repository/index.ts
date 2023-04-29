import { prisma } from '@/config';

async function findBook(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function findRoomById(roomId: number) {
  return prisma.room.findFirst({
    where: { id: roomId },
    include: { Booking: true },
  });
}

async function createBook(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

// async function updateBook(userId: number, roomId: number) {
//   return prisma.booking.update({
//     where:{
//       userId
//     }
//   });
// }

const bookingRepository = { findBook, findRoomById, createBook };

export default bookingRepository;
