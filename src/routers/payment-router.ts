import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketPayment, processPayment } from '@/controllers/payment-controller';
import { paymentSchema } from '@/schemas/payment-schema';

const paymentRouter = Router();

paymentRouter
  .all('/*', authenticateToken)
  .get('/', getTicketPayment)
  .post('/process', validateBody(paymentSchema), processPayment);

export { paymentRouter };
