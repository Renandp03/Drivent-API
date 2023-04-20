import hotelRepository from '@/repositories/hotel-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepositories from '@/repositories/ticket-repository';

async function showHotels() {
  const payedTicketUser = 1;

  const data = await hotelRepository.findHotels();
  return data;
}

const hotelService = { showHotels };

export default hotelService;
