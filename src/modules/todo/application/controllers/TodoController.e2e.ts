import { TodoDto } from '@src/modules/todo/application/dtos/TodoDto';
import { ITestApp, testSetupUtil } from '@test/TestSetupUtil';
import * as request from 'supertest';


describe('TodoController E2E Tests', () => {
  let testApp: ITestApp;
  beforeEach(async () => {
    testApp = await testSetupUtil.startTestApp();
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
      expect(deleteResponse.body.message).toBe(`Todo with ID 999999 not found`);
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


    // update todo tests --- 
    describe('PATCH /todos/:id', () => {

      it('should update a todo by id ', async () => {
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
        const invalidData = { title: 123 }; // Invalid type

        const updateResponse = await request(testApp.app.getHttpServer())
          .patch(`/todos/${todoId}`)
          .send(invalidData);

        expect(updateResponse.status).toBe(400);
        expect(updateResponse.body.message).toContain('title must be a string');
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
    });


    describe('GET /todos', () => {

      const createTodo = async (title: string) => {
        const response = await request(testApp.app.getHttpServer())
          .post('/todos')
          .send({ title });

        return response.body;
      };

      it('should return empty array when no todos exist', async () => {
        const response = await request(testApp.app.getHttpServer()).get('/todos');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });

      it('should return all non-deleted todos', async () => {
        const todo1 = await createTodo('Todo 1');
        const todo2 = await createTodo('Todo 2');

        await request(testApp.app.getHttpServer()).delete(`/todos/${todo1.id}`);

        const response = await request(testApp.app.getHttpServer()).get('/todos');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].id).toBe(todo2.id);
      });

      it('should return todos sorted by creation time', async () => {
        const todoA = await createTodo('A');
        const todoB = await createTodo('B');

        const response = await request(testApp.app.getHttpServer()).get('/todos');

        expect(response.status).toBe(200);
        expect(response.body[0].id).toBe(todoA.id);
        expect(response.body[1].id).toBe(todoB.id);
      });

      it('should ignore todos marked as deleted (manually updated in DB)', async () => {
        const todo = await createTodo('Test Item');

        await testApp.moduleRef
          .get('DataSource')
          .getRepository('Todo')
          .update({ id: todo.id }, { isDeleted: true });

        const response = await request(testApp.app.getHttpServer()).get('/todos');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });

      it('should return todos with required fields', async () => {
        await createTodo('Sample Todo');

        const response = await request(testApp.app.getHttpServer()).get('/todos');

        expect(response.status).toBe(200);
        expect(response.body[0]).toMatchObject({
          id: expect.any(Number),
          title: 'Sample Todo',
          isDeleted: false,
          createdAt: expect.any(String),
        });
      });
    });


  });




});