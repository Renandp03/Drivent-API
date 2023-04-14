import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import ticketServices from '@/services/tickets-service';

export async function getTicketsType(req: AuthenticatedRequest, res: Response) {
  try {
    const tycketTypes = await ticketServices.findAllTicketsType();
    res.send(tycketTypes);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
}
