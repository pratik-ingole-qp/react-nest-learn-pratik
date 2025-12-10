"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
const common_1 = require("@nestjs/common");
const TodoRepository_1 = require("../domain/repositories/TodoRepository");
const TodoEntity_1 = require("../domain/entities/TodoEntity");
let TodoService = class TodoService {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    async createTodo(title) {
        const todo = new TodoEntity_1.TodoEntity();
        todo.title = title;
        return await this.todoRepository.createTodo(todo);
    }
    async getTodoById(id) {
        return await this.todoRepository.getTodoById(id);
    }
    async getAllTodos() {
        return await this.todoRepository.getAllTodos();
    }
    async updateTodo(id, updateData) {
        const todo = await this.todoRepository.getTodoById(id);
        if (!todo)
            return null;
        if (updateData.title !== undefined) {
            todo.title = updateData.title;
        }
        return await this.todoRepository.updateTodo(todo);
    }
    async deleteTodo(id) {
        const todo = await this.todoRepository.getTodoById(id);
        if (!todo)
            return false;
        await this.todoRepository.deleteTodo(id);
        return true;
    }
};
exports.TodoService = TodoService;
exports.TodoService = TodoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [TodoRepository_1.TodoRepository])
], TodoService);
//# sourceMappingURL=TodoService.js.map