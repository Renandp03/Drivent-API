import { TicketType, Ticket } from '@prisma/client';
import ticketRepositories from '@/repositories/ticket-repository';

async function findAllTicketTypes(): Promise<TicketType[]> {
  const data = await ticketRepositories.findTicketTypes();
  return data;
}

async function findAllTyckets(): Promise<Ticket[]> {
  const data = await ticketRepositories.findTickets();
  return data;
}

const ticketServices = { findAllTicketTypes, findAllTyckets };

export default ticketServices;
