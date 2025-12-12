import { TodoEntity } from '../entities/TodoEntity';
import { DataSource, Repository } from 'typeorm';
export declare const TODO_REPOSITORY_PROVIDER: {
    provide: string;
    inject: string[];
    useFactory: (dataSource: DataSource) => Repository<TodoEntity>;
};
