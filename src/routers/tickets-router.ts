import { Router } from 'express';
import { ticketSchema } from '@/schemas/tickets-schema';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketsType, getTicket, postTicket } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketsType)
  .get('/', getTicket)
  .post('/', validateBody(ticketSchema), postTicket);

export { ticketsRouter };
