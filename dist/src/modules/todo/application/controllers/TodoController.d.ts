import { TodoDto } from '../dtos/TodoDto';
import { TodoEntity } from '@modules/todo/domain/entities/TodoEntity';
import { PagerDto } from '../dtos/PagerDto';
import { TodoService } from '@modules/todo/services/TodoService';
import { UpdateTodoDto } from '../dtos/UpdateTodoDto';
export declare class TodoController {
    private readonly todoService;
    private readonly logger;
    constructor(todoService: TodoService);
    createTodo(todoDto: TodoDto): Promise<{
        id: number;
        title: string;
    }>;
    getTodo(id: number): Promise<{
        id: number;
        title: string;
    }>;
    getAllTodos(pager: PagerDto): Promise<{
        id: number;
        title: string;
    }[]>;
    patchTodo(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity>;
    deleteTodo(id: number): Promise<{
        message: string;
    }>;
}
