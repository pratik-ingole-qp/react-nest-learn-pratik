import {TodoService} from '@modules/todo/services/TodoService'
import {TodoDto} from '../dtos/TodoDto'
import {UpdateTodoDto} from '../dtos/UpdateTodoDto'
export declare class TodoController {
  private readonly todoService
  constructor(todoService: TodoService)
  createTodo(
    todoDto: TodoDto,
  ): Promise<import('../../domain/entities/TodoEntity').TodoEntity>
  getTodo(
    id: number,
  ): Promise<import('../../domain/entities/TodoEntity').TodoEntity>
  getAllTodos(): Promise<
    import('../../domain/entities/TodoEntity').TodoEntity[]
  >
  updateTodo(
    id: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<
    | import('../../domain/entities/TodoEntity').TodoEntity
    | {
        message: string
      }
  >
  deleteTodo(id: number): Promise<{
    message: string
  }>
}
