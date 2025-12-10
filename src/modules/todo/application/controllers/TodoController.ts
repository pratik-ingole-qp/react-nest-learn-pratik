import { Body, Controller, Get, Param, ParseIntPipe, Post, Patch, Delete, UsePipes, ValidationPipe, NotFoundException } from '@nestjs/common';
import { TodoService } from '@modules/todo/services/TodoService';
import { TodoDto } from '../dtos/TodoDto';
import { UpdateTodoDto } from '../dtos/UpdateTodoDto';
import { TodoEntity } from '@modules/todo/domain/entities/TodoEntity';
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createTodo(@Body() todoDto: TodoDto) {
    return await this.todoService.createTodo(todoDto.title);
  }
  @Get(':id')
  async getTodo(@Param('id', ParseIntPipe) id: number) {
    const todo = await this.todoService.getTodoById(id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }


  @Get()
  async getAll(): Promise<TodoEntity[]> {
    return this.todoService.getAllTodos();
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto
  ) {
    const updated = await this.todoService.updateTodo(id, updateTodoDto);

    if (!updated) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return updated;
  }

  @Delete(':id')
  async deleteTodo(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.todoService.deleteTodo(id);
    if (!deleted) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return { message: `Todo with ID ${id} deleted successfully` };
  }

}
