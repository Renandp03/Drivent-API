import { prisma } from '@/config';

export type booking = {
  id: number;
  room: {
    id: number;
    name: string;
    capacity: number;
    hotelId: number;
    createdAt: string;
    updatedAt: string;
  };
};

export async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}
