"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TodoEntity_1 = require("../../domain/entities/TodoEntity");
const TodoRepository_1 = require("../../domain/repositories/TodoRepository");
const TestSetupUtil_1 = require("../../../../../test/TestSetupUtil");
const request = require("supertest");
describe('TodoController E2E Tests', () => {
    let testApp;
    let todoRepository;
    beforeEach(async () => {
        testApp = await TestSetupUtil_1.testSetupUtil.startTestApp();
        todoRepository = testApp.app.get(TodoRepository_1.TodoRepository);
        await todoRepository.deleteAllTodos();
    });
    afterEach(async () => {
        await TestSetupUtil_1.testSetupUtil.closeApp(testApp);
    });
    describe('POST /todos', () => {
        it('should create a new todo', async () => {
            const createTodo = { title: 'Test Todo' };
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
        it('should allow exactly 255 characters', async () => {
            const title255 = 'a'.repeat(255);
            const response = await request(testApp.app.getHttpServer())
                .post('/todos')
                .send({ title: title255 });
            expect(response.status).toBe(201);
            expect(response.body.title.length).toBe(255);
        });
        it('should return 400 for 256 characters', async () => {
            const title256 = 'a'.repeat(256);
            const response = await request(testApp.app.getHttpServer())
                .post('/todos')
                .send({ title: title256 });
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('title must be shorter than or equal to 255 characters');
        });
    });
    describe('DELETE /todos/:id', () => {
        it('should delete a todo by id', async () => {
            const createResponse = await request(testApp.app.getHttpServer())
                .post('/todos')
                .send({ title: 'Todo to delete' });
            const id = createResponse.body.id;
            const deleteResponse = await request(testApp.app.getHttpServer()).delete(`/todos/${id}`);
            expect(deleteResponse.status).toBe(200);
            const getResponse = await request(testApp.app.getHttpServer()).get(`/todos/${id}`);
            expect(getResponse.status).toBe(404);
        });
        it('should return 404 if todo does not exist', async () => {
            const response = await request(testApp.app.getHttpServer()).delete('/todos/999999');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Todo with ID 999999 not found');
        });
        it('should return 400 for invalid id format', async () => {
            const response = await request(testApp.app.getHttpServer()).delete('/todos/invalid');
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Validation failed');
        });
        it('should return 404 if todo already deleted', async () => {
            const createResponse = await request(testApp.app.getHttpServer())
                .post('/todos')
                .send({ title: 'Todo' });
            const id = createResponse.body.id;
            await request(testApp.app.getHttpServer()).delete(`/todos/${id}`);
            const second = await request(testApp.app.getHttpServer()).delete(`/todos/${id}`);
            expect(second.status).toBe(404);
        });
    });
    describe('PATCH /todos/:id', () => {
        it('should update a todo', async () => {
            const createResponse = await request(testApp.app.getHttpServer())
                .post('/todos')
                .send({ title: 'Original' });
            const id = createResponse.body.id;
            const updateResponse = await request(testApp.app.getHttpServer())
                .patch(`/todos/${id}`)
                .send({ title: 'Updated' });
            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.title).toBe('Updated');
        });
        it('should return 404 for unknown id', async () => {
            const response = await request(testApp.app.getHttpServer())
                .patch('/todos/999999')
                .send({ title: 'X' });
            expect(response.status).toBe(404);
        });
        it('should return 400 for invalid id', async () => {
            const response = await request(testApp.app.getHttpServer())
                .patch('/todos/invalid')
                .send({ title: 'X' });
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Validation failed');
        });
        it('should return 400 if title is not a string', async () => {
            const create = await request(testApp.app.getHttpServer())
                .post('/todos')
                .send({ title: 'Test' });
            const id = create.body.id;
            const response = await request(testApp.app.getHttpServer())
                .patch(`/todos/${id}`)
                .send({ title: 123 });
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('title must be a string');
        });
    });
    describe('GET /todos Pagination Tests', () => {
        async function createTodos(count) {
            const repo = testApp.app.get(TodoRepository_1.TodoRepository);
            const items = Array.from({ length: count }, (_, i) => {
                const t = new TodoEntity_1.TodoEntity();
                t.title = `Todo ${i + 1}`;
                return t;
            });
            await repo.testingOnlyCreateTodos(items);
        }
        it('should return empty array when no todos exist', async () => {
            const res = await request(testApp.app.getHttpServer()).get('/todos?page=1&limit=10');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });
        it('should return first 10 items', async () => {
            await createTodos(25);
            const res = await request(testApp.app.getHttpServer()).get('/todos?page=1&limit=10');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(10);
            expect(res.body[0].title).toBe('Todo 1');
        });
        it('should return next 10 items', async () => {
            await createTodos(25);
            const res = await request(testApp.app.getHttpServer()).get('/todos?page=2&limit=10');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(10);
            expect(res.body[0].title).toBe('Todo 11');
        });
        it('should return remaining 5 items', async () => {
            await createTodos(25);
            const res = await request(testApp.app.getHttpServer()).get('/todos?page=3&limit=10');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(5);
        });
        it('should return empty for exceeding page', async () => {
            await createTodos(12);
            const res = await request(testApp.app.getHttpServer()).get('/todos?page=5&limit=10');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });
        it('should default page=1 when missing', async () => {
            await createTodos(12);
            const res = await request(testApp.app.getHttpServer()).get('/todos?limit=10');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(10);
        });
        it('should default limit=10 when missing', async () => {
            await createTodos(25);
            const res = await request(testApp.app.getHttpServer()).get('/todos?page=2');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(10);
        });
        it('should default for invalid page', async () => {
            await createTodos(12);
            const res = await request(testApp.app.getHttpServer()).get('/todos?page=abc&limit=10');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(10);
        });
        it('should default for invalid limit', async () => {
            await createTodos(25);
            const res = await request(testApp.app.getHttpServer()).get('/todos?page=2&limit=xyz');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(10);
        });
        it('should return 400 for negative page', async () => {
            const res = await request(testApp.app.getHttpServer()).get('/todos?page=-1&limit=10');
            expect(res.status).toBe(400);
        });
        it('should return 400 for negative limit', async () => {
            const res = await request(testApp.app.getHttpServer()).get('/todos?page=1&limit=-5');
            expect(res.status).toBe(400);
        });
        it('should return 400 for limit=0', async () => {
            const res = await request(testApp.app.getHttpServer()).get('/todos?page=1&limit=0');
            expect(res.status).toBe(400);
        });
    });
});
//# sourceMappingURL=TodoController.e2e.js.map