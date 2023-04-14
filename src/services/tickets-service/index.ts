import { TicketType, Ticket } from '@prisma/client';
import { notFoundError } from '@/errors';
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

const ticketServices = { findAllTicketTypes, findUserTicket };

export default ticketServices;
