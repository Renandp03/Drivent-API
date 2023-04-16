import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function findTicketPayment(ticketId: number): Promise<Payment> {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function createNewPayment(data: inputPayment) {
  return prisma.payment.create({
    data,
  });
}

type inputPayment = {
  ticketId: number;
  value: number;
  cardIssuer: string;
  cardLastDigits: string;
};

const paymentRepositories = { findTicketPayment, createNewPayment };

export default paymentRepositories;
