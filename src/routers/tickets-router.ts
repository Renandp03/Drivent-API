import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketsType, getTicket, postTicket } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', getTicketsType).get('/', getTicket).post('/', postTicket);

export { ticketsRouter };
