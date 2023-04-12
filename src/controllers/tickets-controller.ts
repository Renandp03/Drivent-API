import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';

export async function getTicketsType(req: AuthenticatedRequest, res: Response) {
  try {
    res.send('controller funcionando');
  } catch (error) {
    res.status(error.status).send(error.message);
  }
}
