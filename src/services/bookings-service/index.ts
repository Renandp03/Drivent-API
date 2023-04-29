import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepositories from '@/repositories/ticket-repository';
import { genericError } from '@/errors/generic-error';

async function showBook(userId: number) {
  const data = await bookingRepository.findBook(userId);
  if (!data) throw notFoundError;

  return data;
}

async function addBook(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw genericError(403, 'no enrollment');

  const ticket = await ticketRepositories.findTicketByEnrollment(enrollment.id);
  if (!ticket) throw genericError(403, 'no ticket');
  if (ticket.status != 'PAID') throw genericError(403, 'ticket not paid yet');

  const ticketType = await ticketRepositories.findTicketTipeById(ticket.ticketTypeId);
  if (ticketType.isRemote == true) throw genericError(403, 'this is a remote show.');
  if (ticketType.includesHotel == false) throw genericError(403, 'this ticket do not includes hotel.');

  const room = await bookingRepository.findRoomById(roomId);
  if (!room) throw genericError(404, 'not found error');
  if (room.capacity == room.Booking.length) throw genericError(403, 'no capacity');

  const data = await bookingRepository.createBook(userId, roomId);
  return data;
}

async function changeBook(userId: number, bookId: number, roomId: number) {
  const book = await bookingRepository.findBook(userId);
  if (!book) throw genericError(403, 'no booking');

  return '';
}

const bookingServices = { showBook, addBook, changeBook };

export default bookingServices;
