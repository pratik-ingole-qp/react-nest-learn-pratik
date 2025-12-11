import {TodoRepository} from '../domain/repositories/TodoRepository'
import {TodoEntity} from '../domain/entities/TodoEntity'
import {UpdateTodoDto} from '../application/dtos/UpdateTodoDto'
export declare class TodoService {
  private readonly todoRepository
  constructor(todoRepository: TodoRepository)
  createTodo(title: string): Promise<TodoEntity>
  getTodoById(id: number): Promise<TodoEntity | null>
  getAllTodos(): Promise<TodoEntity[]>
  updateTodo(id: number, updateData: UpdateTodoDto): Promise<TodoEntity | null>
  deleteTodo(id: number): Promise<boolean>
}
