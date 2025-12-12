import { DataSource, Repository } from 'typeorm';
import { TodoEntity } from '../entities/TodoEntity';
export declare const todoRepositoryProvider: {
    provide: string;
    useFactory: (dataSource: DataSource) => Repository<TodoEntity>;
    inject: string[];
}[];
export declare class TodoRepository {
    private readonly todoRepository;
    private logger;
    constructor(todoRepository: Repository<TodoEntity>);
    createTodo(todoEntity: TodoEntity): Promise<TodoEntity>;
    getTodoById(id: number): Promise<TodoEntity | null>;
    getAllTodos(page: number, limit: number): Promise<TodoEntity[]>;
    deleteAllTodos(): Promise<void>;
    testingOnlyCreateTodos(todos: TodoEntity[]): Promise<TodoEntity[]>;
    updateTodo(todoEntity: TodoEntity): Promise<TodoEntity>;
    deleteTodo(id: number): Promise<void>;
}
