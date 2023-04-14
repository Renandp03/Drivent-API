import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function findTickets(): Promise<Ticket[]> {
  return prisma.ticket.findMany();
}

const ticketRepositories = { findTickets, findTicketTypes };

export default ticketRepositories;
