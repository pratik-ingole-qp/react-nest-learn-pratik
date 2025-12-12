import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  Logger,
  Patch,
} from '@nestjs/common'
import { TodoDto } from '../dtos/TodoDto'
import { NotFoundException } from '@nestjs/common'
import { TodoEntity } from '@modules/todo/domain/entities/TodoEntity'
import { PagerDto } from '../dtos/PagerDto'
import { Pager } from '../decorators/Pager.decorator'
import { TodoService } from '@modules/todo/services/TodoService'
import { UpdateTodoDto } from '../dtos/UpdateTodoDto'


@Controller('todos')
export class TodoController {
  private readonly logger = new Logger(TodoController.name)
  constructor(private readonly todoService: TodoService) { }



  @Post()
  async createTodo(
    @Body() todoDto: TodoDto,
  ): Promise<{ id: number; title: string }> {
    return await this.todoService.createTodo(todoDto.title)
  }



  @Get(':id')
  async getTodo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ id: number; title: string }> {
    const todo = await this.todoService.getTodoById(id)
    if (!todo) {
      throw new NotFoundException('Todo not found')
    }
    return todo
  }



  @Get()
  async getAllTodos(@Pager() pager: PagerDto): Promise<{ id: number; title: string }[]> {
    this.logger.warn('Final page & limit:', pager.page, pager.limit);
    return this.todoService.getAllTodos(pager.page, pager.limit);
  }



  @Patch(':id')
  async patchTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity> {
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
