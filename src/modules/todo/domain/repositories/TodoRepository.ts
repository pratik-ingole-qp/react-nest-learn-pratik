import {DataSource, Repository, FindManyOptions} from 'typeorm'
import {TodoEntity} from '../entities/TodoEntity'
import {Inject, Injectable} from '@nestjs/common'

export const TODO_REPOSITORY_PROVIDER = [
  {
    provide: 'TODO_REPOSITORY',
    useFactory: (dataSource: DataSource): Repository<TodoEntity> =>
      dataSource.getRepository(TodoEntity),
    inject: ['DATA_SOURCE'],
  },
]

@Injectable()
export class TodoRepository {
  constructor(
    @Inject('TODO_REPOSITORY')
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async createTodo(todoEntity: TodoEntity): Promise<TodoEntity> {
    return this.todoRepository.save(todoEntity)
  }

  async getTodoById(id: number): Promise<TodoEntity | null> {
    return this.todoRepository.findOne({where: {id}})
  }

  async updateTodo(todoEntity: TodoEntity): Promise<TodoEntity> {
    return this.todoRepository.save(todoEntity)
  }

  async deleteTodo(id: number): Promise<void> {
    await this.todoRepository.delete(id)
  }

  async find(options?: FindManyOptions<TodoEntity>): Promise<TodoEntity[]> {
    return this.todoRepository.find(options)
  }

  async getAllTodos(page: number, limit: number): Promise<TodoEntity[]> {
    const take = limit
    const skip = (page - 1) * limit

    return this.todoRepository.find({
      order: {id: 'ASC'},
      skip,
      take,
    })
  }

  async deleteAllTodos(): Promise<void> {
    await this.todoRepository.clear()
  }

  async testingOnlyCreateTodos(todos: TodoEntity[]): Promise<void> {
    await this.todoRepository.save(todos)
  }
}
