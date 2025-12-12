import {Module} from '@nestjs/common'
import {TodoController} from './application/controllers/TodoController'
import {TodoService} from './services/TodoService'
import {InfraModule} from '@modules/infra/InfraModule'
import {DatabaseModule} from '@modules/infra/database/DataBaseModule'
import {
  TodoRepository,
  todoRepositoryProvider as todoRepositoryProvider,
} from './domain/repositories/TodoRepository'

@Module({
  imports: [InfraModule, DatabaseModule],
  controllers: [TodoController],
  providers: [TodoService, ...todoRepositoryProvider, TodoRepository],
})
export class TodoModule {}
