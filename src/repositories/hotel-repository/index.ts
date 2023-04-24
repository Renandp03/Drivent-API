import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
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

const hotelRepository = { findHotels, findRoomsFromHotel };

export default hotelRepository;
