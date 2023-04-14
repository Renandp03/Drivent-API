import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketsType, getTickets } from '@/controllers/tickets-controller';
import { createEnrollmentSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketsType)
  .get('/', getTickets)
  .post('/', validateBody(createEnrollmentSchema), () => console.log('rodando corretamente'));

export { ticketsRouter };
