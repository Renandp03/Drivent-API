import { Payment } from '@prisma/client';
import paymentRepositories from '@/repositories/payment-repositoy';
import { genericError } from '@/errors/generic-error';
import ticketRepositories from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function findTicketPayment(userId: number, ticketId: number) {
  if (!ticketId) throw genericError(400, 'You need insert some ticket id.');

  const ticket = await ticketRepositories.findTicketByid(ticketId);
  if (!ticket) throw genericError(404, 'No ticked found for this id.');

  const { id: enrollmentId } = await enrollmentRepository.findWithAddressByUserId(userId);
  if (enrollmentId !== ticket.enrollmentId) throw genericError(401, 'This payment is not yours.');

  const data = paymentRepositories.findTicketPayment(ticketId);
  return data;
}

async function makePayment(userId: number, ticketId: number, cardData: cardData) {
  const ticket = await ticketRepositories.ticketInfosForPayment(ticketId);
  if (!ticket) throw genericError(404, 'error');

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (ticket.enrollmentId != enrollment.id) throw genericError(401, 'this ticket is not yours.');

  const inputPayment = {
    ticketId,
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer, // VISA | MASTERCARD
    cardLastDigits: String(cardData.number).slice(-4),
  };
  await ticketRepositories.updateTicketStatus(ticketId);

  const data = await paymentRepositories.createNewPayment(inputPayment);
  return data;
}

type cardData = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: Date;
  cvv: number;
};

const paymentServices = { findTicketPayment, makePayment };

export default paymentServices;
