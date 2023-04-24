import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const hotels = await hotelService.showHotels(userId);
    res.send(hotels);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
}

export async function getRoomsFronHotel(req: AuthenticatedRequest, res: Response) {
  try {
    const hotelId = Number(req.params.hotelId);
    const userId = req.userId;

    const Rooms = await hotelService.getRoomsFronHotel(hotelId, userId);
    return res.send(Rooms);
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}
