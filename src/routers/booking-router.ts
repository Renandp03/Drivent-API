import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getEnrollmentByUser, postCreateOrUpdateEnrollment, getAddressFromCEP } from '@/controllers';
import { createEnrollmentSchema } from '@/schemas';
import { getBook } from '@/controllers/bookings-controller';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBook)
  .post('/', validateBody(createEnrollmentSchema), postCreateOrUpdateEnrollment);

export { bookingRouter };
