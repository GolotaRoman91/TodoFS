import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthDto } from 'src/auth/dto/auth.dto';

const loginDto: AuthDto = {
  login: 'test@email.com',
  password: 'password',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let createdTodoId: number;
  let createdUserId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST) - create a new user', async () => {
    const userData = {
      login: 'JestTestuser2@example.com',
      password: 'testpassword',
    };

    const { body } = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);

    createdUserId = body.id;
    expect(body).toHaveProperty('id', createdUserId);
    expect(body).toHaveProperty('email', userData.login);
    expect(body).toHaveProperty('createdAt');
    expect(body).toHaveProperty('updatedAt');
  });

  it('/auth/login (POST) - success', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    expect(body.access_token).toBeDefined();
    accessToken = body.access_token;
  });

  it('/todos (GET) - success', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/todos')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(body)).toBeTruthy();
    const todo = body[0];
    expect(todo).toHaveProperty('id');
    expect(todo).toHaveProperty('userId');
    expect(todo).toHaveProperty('title');
    expect(todo).toHaveProperty('description');
    expect(todo).toHaveProperty('completed');
    expect(todo).toHaveProperty('createdAt');
    expect(todo).toHaveProperty('updatedAt');
    expect(todo).toHaveProperty('user');
    expect(todo.user).toHaveProperty('id');
    expect(todo.user).toHaveProperty('email');
    expect(todo.user).toHaveProperty('passwordHash');
    expect(todo.user).toHaveProperty('createdAt');
    expect(todo.user).toHaveProperty('updatedAt');
  });

  it('/todos (POST) - create a new todo', async () => {
    const todoData = {
      title: 'New Todo',
      description: 'This is a new todo.',
      completed: false,
    };

    const { body } = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(todoData)
      .expect(201);

    expect(body).toHaveProperty('id');
    createdTodoId = body.id;
  });

  it('/todos/:id (GET) - retrieve a todo by id', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/todos/${createdTodoId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(body).toMatchObject({
      id: createdTodoId,
      title: 'New Todo',
      description: 'This is a new todo.',
      completed: false,
    });
  });

  it('/todos/:id (PATCH) - update a todo', async () => {
    const updatedTodoData = {
      title: 'Updated Todo',
      description: 'This is an updated todo.',
      completed: true,
    };

    const { body } = await request(app.getHttpServer())
      .patch(`/todos/${createdTodoId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updatedTodoData)
      .expect(200);

    expect(body).toMatchObject({
      id: createdTodoId,
      title: 'Updated Todo',
      description: 'This is an updated todo.',
      completed: true,
    });

    const { body: updatedTodo } = await request(app.getHttpServer())
      .get(`/todos/${createdTodoId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(updatedTodo).toMatchObject({
      id: createdTodoId,
      title: 'Updated Todo',
      description: 'This is an updated todo.',
      completed: true,
    });
  });

  it('/todos/:id (DELETE) - success', async () => {
    await request(app.getHttpServer())
      .delete(`/todos/${createdTodoId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const { body: todosAfterDeletion } = await request(app.getHttpServer())
      .get('/todos')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(todosAfterDeletion)).toBeTruthy();
    const deletedTodoExists = todosAfterDeletion.some(
      (todo) => todo.id === createdTodoId,
    );
    expect(deletedTodoExists).toBeFalsy();
  });

  afterEach(async () => {
    await app.close();
  });
});
