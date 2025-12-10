import { TodoEntity } from '@modules/todo/domain/entities/TodoEntity';
import { TodoRepository } from '@modules/todo/domain/repositories/TodoRepository';
import { TodoDto } from '@src/modules/todo/application/dtos/TodoDto';
import { ITestApp, testSetupUtil } from '@test/TestSetupUtil';
import * as request from 'supertest';
import { DataSource, Repository } from 'typeorm';


describe('TodoController E2E Tests', () => {
  let testApp: ITestApp;
  let todoRepository: TodoRepository;
  beforeEach(async () => {
    testApp = await testSetupUtil.startTestApp();
    todoRepository = testApp.app.get<TodoRepository>(TodoRepository);
    await todoRepository.deleteAllTodos();
  });
  afterEach(async () => {
    await testSetupUtil.closeApp(testApp);
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const createTodo: TodoDto = { title: 'Test Todo' };
      const response = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send(createTodo);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(createTodo.title);
      expect(response.body.id).toBeDefined();
    });

    it('should return 400 when body is empty', async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('title should not be empty');
    });

    it('should return 400 when title is empty', async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send({ title: '' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('title should not be empty');
    });

    it('should return 400 when title is not a string', async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send({ title: 123 });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('title must be a string');
    });

    it('should return 400 for a title with 0 characters', async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send({ title: '' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('title should not be empty');
    });

    it('should allow a title with exactly 255 characters', async () => {
      const title255 = 'a'.repeat(255);
      const response = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send({ title: title255 });

      expect(response.status).toBe(201);
      expect(response.body.title.length).toBe(255);
    });

    it('should return 400 for a title with 256 characters', async () => {
      const title256 = 'a'.repeat(256);
      const response = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send({ title: title256 });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("title must be shorter than or equal to 255 characters");
    });

    it('should return 400 when title exceeds max length', async () => {
      const longTitle = 'a'.repeat(300);
      const response = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send({ title: longTitle });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("title must be shorter than or equal to 255 characters");
    });
  });


  describe('DELETE /todos/:id', () => {
    it('should delete a todo by id', async () => {
      const todoToCreate: TodoDto = { title: 'Todo to delete' };
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send(todoToCreate);

      const todoId = createResponse.body.id;

      const deleteResponse = await request(testApp.app.getHttpServer())
        .delete(`/todos/${todoId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.message).toBeDefined();

      const getResponse = await request(testApp.app.getHttpServer())
        .get(`/todos/${todoId}`);

      expect(getResponse.status).toBe(404);
    });

    it('should return 404 if todo does not exist', async () => {
      const deleteResponse = await request(testApp.app.getHttpServer())
        .delete('/todos/999999');

      expect(deleteResponse.status).toBe(404);
      expect(deleteResponse.body.message).toBe('Todo with ID 999999 not found');
    });

    it('should return 400 for invalid id format', async () => {
      const deleteResponse = await request(testApp.app.getHttpServer())
        .delete('/todos/invalid-id');

      expect(deleteResponse.status).toBe(400);
      expect(deleteResponse.body.message).toContain('Validation failed');
    });

    it('should return 404 if todo already deleted', async () => {
      const todoToCreate: TodoDto = { title: 'Todo to delete twice' };
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send(todoToCreate);

      const todoId = createResponse.body.id;

      // First deletion
      await request(testApp.app.getHttpServer()).delete(`/todos/${todoId}`);

      // Second deletion
      const deleteAgainResponse = await request(testApp.app.getHttpServer())
        .delete(`/todos/${todoId}`);

      expect(deleteAgainResponse.status).toBe(404);
      expect(deleteAgainResponse.body.message).toBe(`Todo with ID ${todoId} not found`);
    });
  });


  describe('PATCH /todos/:id', () => {
    it('should update a todo by id', async () => {
      const todoToCreate: TodoDto = { title: 'Original title' };
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send(todoToCreate);

      const todoId = createResponse.body.id;
      const updatedData = { title: 'Updated title' };

      const updateResponse = await request(testApp.app.getHttpServer())
        .patch(`/todos/${todoId}`)
        .send(updatedData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toBe(updatedData.title);

      const getResponse = await request(testApp.app.getHttpServer())
        .get(`/todos/${todoId}`);

      expect(getResponse.body.title).toBe(updatedData.title);
    });

    it('should return 404 if todo does not exist', async () => {
      const updatedData = { title: 'Updated title' };
      const updateResponse = await request(testApp.app.getHttpServer())
        .patch('/todos/999999')
        .send(updatedData);

      expect(updateResponse.status).toBe(404);
      expect(updateResponse.body.message).toBe('Todo with ID 999999 not found');
    });

    it('should return 400 for invalid id format', async () => {
      const updatedData = { title: 'Updated title' };
      const updateResponse = await request(testApp.app.getHttpServer())
        .patch('/todos/invalid-id')
        .send(updatedData);

      expect(updateResponse.status).toBe(400);
      expect(updateResponse.body.message).toContain('Validation failed');
    });

    it('should return 400 if title is not a string', async () => {
      const todoToCreate: TodoDto = { title: 'Original title' };
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send(todoToCreate);

      const todoId = createResponse.body.id;
      const invalidData = { title: 123 };

      const updateResponse = await request(testApp.app.getHttpServer())
        .patch(`/todos/${todoId}`)
        .send(invalidData);

      expect(updateResponse.status).toBe(400);
      expect(updateResponse.body.message).toContain('title must be a string');
    });

    it('should return 400 for a title with 0 characters', async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send({ title: '' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('title should not be empty');
    });

    it('should allow a title with exactly 255 characters', async () => {
      const title255 = 'a'.repeat(255);
      const response = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send({ title: title255 });

      expect(response.status).toBe(201);
      expect(response.body.title.length).toBe(255);
    });

    it('should return 400 for a title with 256 characters', async () => {
      const title256 = 'a'.repeat(256);
      const response = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send({ title: title256 });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("title must be shorter than or equal to 255 characters");
    });

    it('should return 400 when title exceeds max length', async () => {
      const longTitle = 'a'.repeat(300);
      const response = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send({ title: longTitle });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("title must be shorter than or equal to 255 characters");
    });

    it('should return 400 if request body contains unknown fields', async () => {
      const todoToCreate: TodoDto = { title: 'Original title' };
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send(todoToCreate);

      const todoId = createResponse.body.id;
      const invalidData = { unknownField: 'invalid' };

      const updateResponse = await request(testApp.app.getHttpServer())
        .patch(`/todos/${todoId}`)
        .send(invalidData);

      expect(updateResponse.status).toBe(400);
      expect(updateResponse.body.message[0]).toContain('should not exist');
    });



    describe('GET /todos', () => {
      it('should return a maximum of 10 todos if more exist', async () => {
        // Create 15 todos
        for (let i = 1; i <= 15; i++) {
          await request(testApp.app.getHttpServer())
            .post('/todos')
            .send({ title: `Todo ${i}` });
        }

        const response = await request(testApp.app.getHttpServer())
          .get('/todos');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(10); // max 10

        // Extra validations
        response.body.forEach((todo: any) => {
          expect(todo.isDeleted).toBe(false);
          expect(typeof todo.title).toBe('string');
          expect(todo.title.length).toBeGreaterThan(0);
          expect(new Date(todo.createdAt).toString()).not.toBe('Invalid Date');
        });
      });

      it('should return all todos if less than 10 exist', async () => {
        // Create 5 todos
        for (let i = 1; i <= 5; i++) {
          await request(testApp.app.getHttpServer())
            .post('/todos')
            .send({ title: `Todo ${i}` });
        }

        const response = await request(testApp.app.getHttpServer())
          .get('/todos');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(5); // all todos

        // Extra validations
        response.body.forEach((todo: any) => {
          expect(todo.isDeleted).toBe(false);
          expect(typeof todo.title).toBe('string');
          expect(todo.title.length).toBeGreaterThan(0);
          expect(new Date(todo.createdAt).toString()).not.toBe('Invalid Date');
        });
      });

      it('should return empty array if no todos exist', async () => {
        const response = await request(testApp.app.getHttpServer())
          .get('/todos');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
      });
    });
  });




});