export type booking = {
  id: number;
  room: {
    id: number;
    name: string;
    capacity: number;
    hotelId: number;
    createdAt: string;
    updatedAt: string;
  };
};
