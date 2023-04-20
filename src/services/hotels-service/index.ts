import hotelRepository from '@/repositories/hotel-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepositories from '@/repositories/ticket-repository';
import { unauthorizedError } from '@/errors';

async function showHotels(userId: number) {
  const payedTicketUser = await hotelRepository.payedTicketUser(userId);
  if (!payedTicketUser.Ticket) throw unauthorizedError;

  const data = await hotelRepository.findHotels();
  return data;
}

const hotelService = { showHotels };

export default hotelService;
