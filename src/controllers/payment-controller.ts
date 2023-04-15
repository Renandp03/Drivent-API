import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentServices from '@/services/payment-service';

export async function getTicketPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const ticketId = req.query.ticketId;
    const tickekPayment = await paymentServices.findTicketPayment(userId, Number(ticketId));

    res.send(tickekPayment);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
}

export async function processPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const { ticketId, cardData } = req.body;
    const userId = req.userId;
    const result = await paymentServices.makePayment(userId, ticketId, cardData);

    res.send(result);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
}
