import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function findTicket(userId: number): Promise<Ticket> {
  return prisma.ticket.findFirst({ where: { enrollmentId: userId } });
}

async function createTicket(userId: number, ticketTypeId: number) {
  return prisma.ticket.create({
    data: {
      status: 'RESERVED',
      ticketTypeId,
      enrollmentId: userId,
    },
    include: {
      TicketType: true,
    },
  });
}
async function findNewticket(userId: number, ticketTypeId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId: userId,
    },
  });
}

const ticketRepositories = { findTicket, findTicketTypes, createTicket };

export default ticketRepositories;
