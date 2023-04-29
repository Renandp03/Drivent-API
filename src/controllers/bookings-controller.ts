import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingServices from '@/services/bookings-service';

export async function getBook(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const book = await bookingServices.showBook(userId);
    res.send(book);
  } catch (error) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postBook(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const { roomId } = req.body;
    const newBook = await bookingServices.addBook(userId, roomId);
    res.status(httpStatus.OK).send(newBook);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
}

export async function updateBook(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const bookId = Number(req.params);
    const roomId = req.body;
    const book = await bookingServices.changeBook(userId, bookId, roomId);
    res.send(book);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
}
