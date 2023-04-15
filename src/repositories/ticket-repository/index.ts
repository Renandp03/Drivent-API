import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function findTicket(userId: number): Promise<Ticket> {
  return prisma.ticket.findFirst({ where: { enrollmentId: userId } });
}

async function createTicket(enrollmentId: number, ticketTypeId: number) {
  return prisma.ticket.create({
    data: {
      TicketType: {
        connect: {
          id: ticketTypeId,
        },
      },
      Enrollment: {
        connect: {
          id: enrollmentId,
        },
      },
      status: 'RESERVED',
    },
    include: {
      TicketType: true,
    },
  });
}

const ticketRepositories = { findTicket, findTicketTypes, createTicket };

export default ticketRepositories;
