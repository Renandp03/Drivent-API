import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketServices from '@/services/tickets-service';

export async function getTicketsType(req: AuthenticatedRequest, res: Response) {
  try {
    const tycketTypes = await ticketServices.findAllTicketTypes();
    res.send(tycketTypes);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send('some problems in the server');
  }
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const ticket = await ticketServices.findUserTicket(userId);

    res.send(ticket);
  } catch (error) {
    res.status(httpStatus.NOT_FOUND).send('You heve no ticket yet');
  }
}

export async function createType(req: AuthenticatedRequest, res: Response) {
  try {
    const { ticketTypeId } = req.body;
    const userId = req.userId;

    const ticket = await ticketServices.createNewTicket(userId, ticketTypeId);
    res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    res.status(500).send('error');
  }
}
