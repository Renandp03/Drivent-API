import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingSchema } from '@/schemas/booking-schemas';
import { getBook, postBook, putBook } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBook)
  .post('/', validateBody(bookingSchema), postBook)
  .put('/:bookingId', validateBody(bookingSchema), putBook);

export { bookingRouter };
