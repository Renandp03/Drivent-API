import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const result = await hotelService.showHotels(userId);
    res.send(result);
  } catch (error) {
    if ((error.name = '')) {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}

export async function getRoomsFronHotel(req: AuthenticatedRequest, res: Response) {
  try {
    const hotelId = Number(req.params.hotelId);

    const Rooms = await hotelService.getRoomsFronHotel(hotelId);
    return res.send(Rooms);
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}
