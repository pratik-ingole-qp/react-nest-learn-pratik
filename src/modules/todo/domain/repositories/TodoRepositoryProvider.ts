import { DATA_SOURCE } from '@modules/infra/database/constants/DatabaseConstants';
import { TodoEntity } from '../entities/TodoEntity';
import { DataSource, Repository } from 'typeorm';

export const TODO_REPOSITORY_PROVIDER = {
  provide: 'TODO_REPOSITORY',
  inject: [DATA_SOURCE],
  useFactory: (dataSource: DataSource): Repository<TodoEntity> => {
    return dataSource.getRepository(TodoEntity);
  },
};
