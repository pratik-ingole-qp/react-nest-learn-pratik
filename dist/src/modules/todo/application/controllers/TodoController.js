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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoController = void 0;
const common_1 = require("@nestjs/common");
const TodoService_1 = require("../../services/TodoService");
const TodoDto_1 = require("../dtos/TodoDto");
const UpdateTodoDto_1 = require("../dtos/UpdateTodoDto");
let TodoController = class TodoController {
    constructor(todoService) {
        this.todoService = todoService;
    }
    async createTodo(todoDto) {
        return await this.todoService.createTodo(todoDto.title);
    }
    async getTodo(id) {
        const todo = await this.todoService.getTodoById(id);
        if (!todo) {
            throw new common_1.NotFoundException(`Todo with ID ${id} not found`);
        }
        return todo;
    }
    async getAllTodos() {
        return await this.todoService.getAllTodos();
    }
    async updateTodo(id, updateTodoDto) {
        const updated = await this.todoService.updateTodo(id, updateTodoDto);
        if (!updated) {
            return { message: `Todo with ID ${id} not found` };
        }
        return updated;
    }
    async deleteTodo(id) {
        const deleted = await this.todoService.deleteTodo(id);
        if (!deleted) {
            throw new common_1.NotFoundException(`Todo with ID ${id} not found`);
        }
        return { message: `Todo with ID ${id} deleted successfully` };
    }
};
exports.TodoController = TodoController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TodoDto_1.TodoDto]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "createTodo", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "getTodo", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "getAllTodos", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateTodoDto_1.UpdateTodoDto]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "updateTodo", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "deleteTodo", null);
exports.TodoController = TodoController = __decorate([
    (0, common_1.Controller)('todos'),
    __metadata("design:paramtypes", [TodoService_1.TodoService])
], TodoController);
//# sourceMappingURL=TodoController.js.map