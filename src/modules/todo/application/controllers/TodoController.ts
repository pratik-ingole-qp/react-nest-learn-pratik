import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { TodoService } from '@modules/todo/services/TodoService'
import { TodoDto } from '../dtos/TodoDto'
import { UpdateTodoDto } from '../dtos/UpdateTodoDto'

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createTodo(@Body() todoDto: TodoDto): Promise<TodoDto> {
    return this.todoService.createTodo(todoDto.title)
  }

  @Get(':id')
  async getTodo(@Param('id', ParseIntPipe) id: number): Promise<TodoDto> {
    const todo = await this.todoService.getTodoById(id)

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`)
    }

    return todo
  }

  @Get()
  getAllTodos(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<TodoDto[]> {
    return this.todoService.getAllTodos(page, limit)
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoDto> {
    const updated = await this.todoService.updateTodo(id, updateTodoDto)

    if (!updated) {
      throw new NotFoundException(`Todo with ID ${id} not found`)
    }

    return updated
  }

  @Delete(':id')
  async deleteTodo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    const deleted = await this.todoService.deleteTodo(id)

    if (!deleted) {
      throw new NotFoundException(`Todo with ID ${id} not found`)
    }

    return { message: `Todo with ID ${id} deleted successfully` }
  }
}
