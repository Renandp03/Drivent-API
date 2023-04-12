import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketsType } from '@/controllers/tickets-controller';
import { createEnrollmentSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  //   .all('/*', authenticateToken)
  .get('/type', getTicketsType)
  .get('/', () => console.log('rodando corretamente'))
  .post('/', validateBody(createEnrollmentSchema), () => console.log('rodando corretamente'));

export { ticketsRouter };
