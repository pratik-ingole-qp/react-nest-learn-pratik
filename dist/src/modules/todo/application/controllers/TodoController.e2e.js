'use strict'
Object.defineProperty(exports, '__esModule', {value: true})
const TestSetupUtil_1 = require('../../../../../test/TestSetupUtil')
const request = require('supertest')
describe('TodoController E2E Tests', () => {
  let testApp
  beforeEach(async () => {
    testApp = await TestSetupUtil_1.testSetupUtil.startTestApp()
  })
  afterEach(async () => {
    await TestSetupUtil_1.testSetupUtil.closeApp(testApp)
  })
  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const createTodo = {title: 'Test Todo'}
      const response = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send(createTodo)
      expect(response.status).toBe(201)
      expect(response.body.title).toBe(createTodo.title)
      expect(response.body.id).toBeDefined()
    })
  })
  describe('DELETE /todos/:id', () => {
    it('should delete a todo by id', async () => {
      const todoToCreate = {title: 'Todo to delete'}
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send(todoToCreate)
      const todoId = createResponse.body.id
      const deleteResponse = await request(testApp.app.getHttpServer()).delete(
        `/todos/${todoId}`,
      )
      expect(deleteResponse.status).toBe(200)
      expect(deleteResponse.body.message).toBeDefined()
      const getResponse = await request(testApp.app.getHttpServer()).get(
        `/todos/${todoId}`,
      )
      expect(getResponse.status).toBe(404)
    })
  })
})
//# sourceMappingURL=TodoController.e2e.js.map
