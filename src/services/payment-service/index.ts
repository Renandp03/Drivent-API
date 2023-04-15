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
  if (!ticketId || !cardData) throw genericError(400, 'Please enter your ticket id and card details.');

  const ticket = await ticketRepositories.findTicketByid(ticketId);
  if (!ticket) throw genericError(404, 'Ticket not foud');

  const { id } = await ticketRepositories.findTicketByEnrollment(userId);
  if (id != ticket.enrollmentId) throw genericError(401, 'This ticket is not yours.');
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
