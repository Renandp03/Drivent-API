import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function findTicketPayment(ticketId: number): Promise<Payment> {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

const paymentRepositories = { findTicketPayment };

export default paymentRepositories;
