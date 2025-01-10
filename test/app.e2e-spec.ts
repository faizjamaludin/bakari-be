import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';




describe('App e2e', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init()
    await app.listen(3000)

    prisma = app.get(PrismaService)

    await prisma.cleanDb
    pactum.request.setBaseUrl('http://localhost:3000')
  });

  afterAll(async () => {
    app.close();
  });


  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'paishx4@gmail.com',
      password: "password",
      firstName: 'ahmad',
      lastName: 'faiz',
      role: 'staff'
    }
    describe('Signup', () => {
      it('should create a new user', () => {

        return pactum.spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
      })
    });
    describe('Signin', () => {
      it('should signup', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(201)
      })
    });
  });


  describe('User', () => {
    describe('Get me', () => { });
  });
});