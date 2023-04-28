import { notFoundError } from '@/errors';

async function getBook(userId: number) {
  const data = 0;
  if (!data) throw notFoundError;
  return data;
}

const bookingServices = { getBook };

export default bookingServices;
