import hotelRepository from '@/repositories/hotel-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepositories from '@/repositories/ticket-repository';
import { genericError } from '@/errors/generic-error';

async function showHotels(userId: number) {
  validateTicket(userId);

  const data = await hotelRepository.findHotels();
  if (!data[0]) throw genericError(404, 'not found hotels');
  return data;
}

async function getRoomsFromHotel(hotelId: number, userId: number) {
  validateTicket(userId);

  const data = await hotelRepository.findRoomsFromHotel(hotelId);
  if (!data) throw genericError(404, 'no rooms for this hotel');

  return data;
}

async function validateTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw genericError(404, 'no enrollment');

  const ticket = await ticketRepositories.findTicketByEnrollment(enrollment.id);
  if (!ticket) throw genericError(404, 'no ticket');
  if (ticket.status != 'PAID') throw genericError(402, 'ticket not paid yet');

  const ticketType = await ticketRepositories.findTicketTipeById(ticket.ticketTypeId);
  if (ticketType.isRemote == true) throw genericError(402, 'this is a remote show.');
  if (ticketType.includesHotel == false) throw genericError(402, 'this ticket do not includes hotel.');
}

const hotelService = { showHotels, getRoomsFromHotel };

export default hotelService;

// const enrollment = await hotelRepository.payedTicketUser(userId);
// const { status } = enrollment.Ticket[0];
// const { isRemote } = enrollment.Ticket[0].TicketType;
// const { includesHotel } = enrollment.Ticket[0].TicketType;

// if (!enrollment) throw genericError(404, 'no enrollment');
// if (!status) throw genericError(404, 'no ticket');
// if (status != 'PAID') throw genericError(402, 'ticket not paid yet');
// if (isRemote == true) throw genericError(402, 'ticket is remote');
// if (includesHotel == false) throw genericError(402, 'ticket do not includes hotel');
