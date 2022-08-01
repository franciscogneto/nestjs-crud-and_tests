import { HttpCode, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto, CreateBookmarkDto, EditBookmarkDto } from '../src/dto';
import { domainToASCII } from 'url';
import { EditUserDto } from '../src/dto/edit-user.dto';


describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@test.com.br',
      password: '123'
    }
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum.spec().post('/auth/signup').withBody({
          password: dto.password,
        }).expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum.spec().post('/auth/signup').withBody({
          email: dto.email,
        }).expectStatus(400);
      });
      it('should throw if no body is provided', () => {
        return pactum.spec().post('/auth/signup')
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum.spec().post('/auth/signup').withBody({
          email: dto.email,
          password: dto.password
        }).expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum.spec().post('/auth/signin').withBody({
          password: dto.password
        }).expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum.spec().post('/auth/signin').withBody({
          email: dto.email
        }).expectStatus(400);

      });
      it('should throw if no body is provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', () => {
        return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200).stores('userAt', 'access_token'); // stores armazena no pactum o acces token para usar posteriormente

      });
    });

    describe('User', () => {
      describe('Get me', () => {
        it('Should get the current user', () => {
          return pactum.spec().get('/users/me').withHeaders({
            Authorization: 'Bearer $S{userAt}'
          }).expectStatus(200);
        });
      });
    });
    describe('Edit user', () => {
      it('Should edit user', () => {
        const dto: EditUserDto = {
          email: "testEdited@test.com",
          firstName: "Xicao",
          lastName: " XxX"
        }

        return pactum.spec().patch('/users').withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName)
          .expectBodyContains(dto.email)
      });
    });
    describe('Bookmarks', () => {
      describe('Get Empty bookmarks', () => {
        it('sould get bookmarks', () => {
          return pactum.spec().get('/bookmarks').withHeaders({
            Authorization: 'Bearer $S{userAt}'
          }).expectStatus(200).expectBody([]);
        });
      });
      const createBookmarkDto: CreateBookmarkDto = {
        link: "www.amazon.com.br",
        title: "Como Fazer amigos e influenciar pessoas",
      }

      describe('Create bookmarkk', () => {
        it('should create a bookmark', () => {
          return pactum.spec().post('/bookmarks').withHeaders({
            Authorization: 'Bearer $S{userAt}'
          }).withBody(createBookmarkDto).expectStatus(201).stores('book_id', 'id')
        })

      });
      describe('Get bookmarks', () => {
        it('should get all bookmarks of an user ', ()=>{
          return pactum.spec().get('/bookmarks').withHeaders({
            Authorization: 'Bearer $S{userAt}'
          }).expectBodyContains(createBookmarkDto.link).expectBodyContains(createBookmarkDto.title).expectStatus(200);
        });
      });
      describe('Get bookmarks by id', () => {
        it('should get bookmark by id', ()=>{
          return pactum.spec().get('/bookmarks/$S{book_id}').withHeaders({
            Authorization: 'Bearer $S{userAt}'
          }).expectBodyContains(createBookmarkDto.link).expectBodyContains(createBookmarkDto.title).expectStatus(200);
        });

      });
      const editBookmarkDto:EditBookmarkDto = {
        description: "Livro com enfâse em comunicação"
      }
      describe('Edit bookmark', () => {
        it('should edit a bookmark', () => {
          return pactum.spec().patch('/bookmarks/$S{book_id}').withHeaders({
            Authorization: 'Bearer $S{userAt}'
          }).withBody(editBookmarkDto)
          .expectBodyContains(createBookmarkDto.link)
          .expectBodyContains(createBookmarkDto.title)
          .expectBodyContains(editBookmarkDto.description)
          .expectStatus(200).inspect();
        });

      });
      describe('Delete bookmarks', () => {
        it('Should delete a bookmark by id', ()=> {
          return pactum.spec().delete('/bookmarks/$S{book_id}').withHeaders({
            Authorization: 'Bearer $S{userAt}'
          }).expectStatus(204).inspect()
        });
      });
    });
  })
});