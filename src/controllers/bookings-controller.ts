import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';

export async function getBook(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const book = 'qualquer coisa';
    res.send(book);
  } catch (error) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}
