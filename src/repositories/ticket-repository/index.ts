import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function findTicket(userId: number): Promise<Ticket> {
  return prisma.ticket.findFirst({ where: { enrollmentId: userId } });
}

const ticketRepositories = { findTicket, findTicketTypes };

export default ticketRepositories;
