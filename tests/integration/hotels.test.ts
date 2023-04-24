import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import { createUser, createTicketType, createEnrollmentWithAddress, createTicket } from '../factories';
import { prisma } from '@/config';
import app, { init } from '@/app';

const server = supertest(app);

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/enrollments');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/enrollments').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/enrollments').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('When token is valid', () => {
  it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
    const token = await generateValidToken();

    const response = await server.get('/tickets').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 when user doesnt have a ticket yet', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);

    const response = await server.get('/tickets').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  // it('should response whith status 404 when hotel id is not falid', async () => {
  //   const user = await createUser();
  //   const token = await generateValidToken(user);
  //   const enrollment = await createEnrollmentWithAddress(user);
  //   const ticketType = await createTicketType();
  //   const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

  //   await server.get('/hotels').set('Authorization', `Bearer ${token}`).send({ ticketTypeId: ticketType.id });
  // });
});
