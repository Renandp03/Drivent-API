import hotelRepository from '@/repositories/hotel-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepositories from '@/repositories/ticket-repository';
import { unauthorizedError } from '@/errors';

async function showHotels(userId: number) {
  const payedTicketUser = await hotelRepository.payedTicketUser(userId);
  if (!payedTicketUser.Ticket) throw unauthorizedError;

  const data = await hotelRepository.findHotels();
  console.log(data);
  return data;
}

async function getRoomsFronHotel(hotelId: number, userId: number) {
  const payedTicketUser = await hotelRepository.payedTicketUser(userId);
  console.log(payedTicketUser);
  if (!payedTicketUser.Ticket) throw unauthorizedError;

  const data = await hotelRepository.findRoomsFromHotel(hotelId);
  console.log(data);
  if (!data) throw unauthorizedError;

  return data;
}

const hotelService = { showHotels, getRoomsFronHotel };

export default hotelService;
