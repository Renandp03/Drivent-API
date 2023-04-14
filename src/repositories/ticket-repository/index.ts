import { TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findTickets() {
  return prisma.ticketType.findMany();
}

const ticketRepositories = { findTickets };

export default ticketRepositories;
