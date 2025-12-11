import {TodoEntity} from '../entities/TodoEntity'
import {DataSource, Repository} from 'typeorm'
export declare const TodoRepositoryProvider: {
  provide: string
  inject: string[]
  useFactory: (dataSource: DataSource) => Repository<TodoEntity>
}
