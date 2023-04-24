import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function findTicketTipeById(id: number): Promise<TicketType> {
  return prisma.ticketType.findFirst({
    where: {
      id,
    },
  });
}

async function findTicketByEnrollment(enrollmentId: number): Promise<Ticket> {
  return prisma.ticket.findFirst({
    include: {
      TicketType: true,
    },
    where: {
      enrollmentId,
    },
  });
}

async function findTicketByid(id: number): Promise<Ticket> {
  return prisma.ticket.findUnique({
    where: {
      id,
    },
  });
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

async function ticketInfosForPayment(id: number) {
  return prisma.ticket.findFirst({
    where: {
      id,
    },
    include: {
      TicketType: {
        select: {
          price: true,
        },
      },
    },
  });
}

async function updateTicketStatus(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: 'PAID',
    },
  });
}

const ticketRepositories = {
  findTicketByid,
  findTicketByEnrollment,
  findTicketTypes,
  createTicket,
  updateTicketStatus,
  ticketInfosForPayment,
  findTicketTipeById,
};

export default ticketRepositories;
