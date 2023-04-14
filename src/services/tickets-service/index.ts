import ticketRepositories from '@/repositories/ticket-repository';

async function findAllTicketsType() {
  const data = await ticketRepositories.findTickets();
  return data;
}

const ticketServices = { findAllTicketsType };

export default ticketServices;
