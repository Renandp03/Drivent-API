import hotelRepository from '@/repositories/hotel-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepositories from '@/repositories/ticket-repository';
import { unauthorizedError } from '@/errors';
import { genericError } from '@/errors/generic-error';

async function showHotels(userId: number) {
  const enrollment = await hotelRepository.payedTicketUser(userId);
  const { status } = enrollment.Ticket[0];
  const { isRemote } = enrollment.Ticket[0].TicketType;
  const { includesHotel } = enrollment.Ticket[0].TicketType;

  if (!enrollment) throw genericError(404, 'no enrollment');
  if (!status) throw genericError(404, 'no ticket');
  if (status != 'PAID') throw genericError(402, 'ticket not paid yet');
  if (isRemote == true) throw genericError(402, 'ticket is remote');
  if (includesHotel == false) throw genericError(402, 'ticket do not includes hotel');

  const data = await hotelRepository.findHotels();
  if (!data) throw genericError(404, 'not found hotels');
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
