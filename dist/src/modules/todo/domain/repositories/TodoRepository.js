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
var TodoRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoRepository = exports.todoRepositoryProvider = void 0;
const typeorm_1 = require("typeorm");
const TodoEntity_1 = require("../entities/TodoEntity");
const common_1 = require("@nestjs/common");
exports.todoRepositoryProvider = [
    {
        provide: 'TODO_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(TodoEntity_1.TodoEntity),
        inject: ['DATA_SOURCE'],
    },
];
let TodoRepository = TodoRepository_1 = class TodoRepository {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
        this.logger = new common_1.Logger(TodoRepository_1.name);
    }
    async createTodo(todoEntity) {
        return await this.todoRepository.save(todoEntity);
    }
    async getTodoById(id) {
        return await this.todoRepository.findOne({ where: { id } });
    }
    async getAllTodos(page, limit) {
        const take = limit;
        const skip = (page - 1) * limit;
        this.logger.warn(typeof limit, typeof page, limit, page);
        this.logger.warn('skip value is ', skip);
        return await this.todoRepository.find({
            order: { id: 'ASC' },
            skip,
            take,
        });
    }
    async deleteAllTodos() {
        await this.todoRepository.clear();
    }
    async testingOnlyCreateTodos(todos) {
        return await this.todoRepository.save(todos);
    }
    async updateTodo(todoEntity) {
        return await this.todoRepository.save(todoEntity);
    }
    async deleteTodo(id) {
        await this.todoRepository.delete(id);
    }
};
exports.TodoRepository = TodoRepository;
exports.TodoRepository = TodoRepository = TodoRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('TODO_REPOSITORY')),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], TodoRepository);
//# sourceMappingURL=TodoRepository.js.map