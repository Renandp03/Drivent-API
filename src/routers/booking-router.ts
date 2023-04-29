import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingSchema } from '@/schemas/booking-schemas';
import { getBook, postBook } from '@/controllers/bookings-controller';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('/', getBook).post('/', validateBody(bookingSchema), postBook);

export { bookingRouter };
