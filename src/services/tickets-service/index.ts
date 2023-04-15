import { TicketType, Ticket } from '@prisma/client';
import { notFoundError } from '@/errors';
import { genericError } from '@/errors/generic-error';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepositories from '@/repositories/ticket-repository';

async function findAllTicketTypes(): Promise<TicketType[]> {
  const data = await ticketRepositories.findTicketTypes();
  return data;
}

async function findUserTicket(userId: number): Promise<Ticket> {
  const data = await ticketRepositories.findTicket(userId);

  if (!data) throw notFoundError;

  return data;
}

async function createNewTicket(userId: number, ticketTypeId: number) {
  const enrollment = enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw genericError(404, 'You have no enrollment for this.');

  const data = await ticketRepositories.createTicket(userId, ticketTypeId);
  return data;
}

const ticketServices = { findAllTicketTypes, findUserTicket, createNewTicket };

export default ticketServices;
