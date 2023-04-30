import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import {
  createRemoteTicketType,
  createNotRemoteTicketType,
  createNotIncludeTicketType,
  createUser,
  createEnrollmentWithAddress,
  createTicket,
  createHotel,
  createRoom,
  createNotCapacityRoom
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { createBooking } from '../factories/booking-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('when token is valid', () => {
  it('Should respond with status 404 if user do not have a book', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
  it('Should respond with status 200 and booking', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('When token is valid', () => {
  it('Should respond with status 403 if user have no enrollment', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('Should respond with status 403 if user have no ticket', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('Should respond with status 403 if user ticket is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createRemoteTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('Should respond with status 403 if user ticket is is not paid yet', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createNotRemoteTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('Should respond with status 403 if user ticket do not includes hotel', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createNotIncludeTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('Should respond with status 404 if room do not exists', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createNotRemoteTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('Should respond with status 200 and new booking', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createNotRemoteTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createHotel();
    const room = await createRoom();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toMatchObject({"bookingId":expect.any(Number)});

  });
});

describe('PUT /booking/:bookingId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const userWithoutSession = await createUser();
    const room = await createRoom();
    const book = await createBooking(userWithoutSession.id, room.id);
    const response = await server.put(`/booking/${book.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const userWithoutSession = await createUser();
    const token = faker.lorem.word();
    const room = await createRoom();
    const book = await createBooking(userWithoutSession.id, room.id);

    const response = await server.put(`/booking/${book.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const room = await createRoom();
    const book = await createBooking(userWithoutSession.id, room.id);

    const response = await server.put(`/booking/${book.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('When token is valid', () => {
  it('Should return with status 404 if roomId no not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const room = await createRoom();
    const book = await createBooking(user.id, room.id);

    const response = await server
      .put(`/booking/${book.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ roomId: 0});

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('Should return with status 403 if user have no booking', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createNotRemoteTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createHotel();
    const room = await createRoom();
    const newRoow = await createRoom();

    const response = await server
      .put(`/booking/0`)
      .set('Authorization', `Bearer ${token}`)
      .send({ roomId: newRoow.id });

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('Should return with status 403 if roomId have no capacity', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createNotRemoteTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createHotel();
    const room = await createRoom();
    const newRoow = await createNotCapacityRoom();
    const book = await createBooking(user.id, room.id);

    const response = await server
      .put(`/booking/${book.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ roomId: newRoow.id });

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('Should return with status 200 and bookingId', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createNotRemoteTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createHotel();
    const room = await createRoom();
    const newRoow = await createRoom();
    const book = await createBooking(user.id, room.id);

    const response = await server
      .put(`/booking/${book.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ roomId: newRoow.id });

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toMatchObject({"bookingId":expect.any(Number)});
  });
});

