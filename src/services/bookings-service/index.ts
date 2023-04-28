import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';

async function showBook(userId: number) {
  const data = await bookingRepository.findBook(userId);
  if (!data) throw notFoundError;

  return data;
}

const bookingServices = { showBook };

export default bookingServices;
