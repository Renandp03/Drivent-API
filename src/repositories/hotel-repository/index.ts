import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsFromHotel(id: number) {
  return prisma.hotel.findFirst({
    where: {
      id,
    },
    include: {
      Rooms: {
        where: {
          hotelId: id,
        },
      },
    },
  });
}

const hotelRepository = { findHotels, findRoomsFromHotel };

export default hotelRepository;
