import { Router } from 'express';
import { authenticateToken } from '@/middlewares';

const paymentRouter = Router();

paymentRouter
  .all('/*', authenticateToken)
  .get('?ticketId', () => console.log('hello word'))
  .post('/', () => console.log('hello word'));

export { paymentRouter };
