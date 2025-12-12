import {Injectable} from '@nestjs/common'
import {TodoRepository} from '../domain/repositories/TodoRepository'
import {TodoEntity} from '../domain/entities/TodoEntity'
import {UpdateTodoDto} from '../application/dtos/UpdateTodoDto'

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}
  async createTodo(title: string): Promise<TodoEntity> {
    const todo = new TodoEntity()
    todo.title = title
    return await this.todoRepository.createTodo(todo)
  }
  async getTodoById(id: number): Promise<TodoEntity | null> {
    return await this.todoRepository.getTodoById(id)
  }
  async getAllTodos(page: number, limit: number): Promise<TodoEntity[]> {
    return await this.todoRepository.getAllTodos(page, limit)
  }
  async updateTodo(
    id: number,
    updateData: UpdateTodoDto,
  ): Promise<TodoEntity | null> {
    const todo = await this.todoRepository.getTodoById(id)
    if (!todo) {
      return null
    }
    if (updateData.title !== undefined) {
      todo.title = updateData.title
    }
    return await this.todoRepository.updateTodo(todo)
  }
  async deleteTodo(id: number): Promise<boolean> {
    const todo = await this.todoRepository.getTodoById(id)
    if (!todo) return false
    await this.todoRepository.deleteTodo(id)
    return true
  }
}
