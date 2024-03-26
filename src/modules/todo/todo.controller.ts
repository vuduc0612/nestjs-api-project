import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';

import { TodoService } from './todo.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { Todo } from './entity/todo.entity';


@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('todos')
export class TodoController {
    constructor(private todoService: TodoService) { }

    @Get()
    async findAll(@GetUser() user: User) {
        return this.todoService.findAll(user.id);
    }

    @Post()
    async create(@Body() todo: Todo, @GetUser() user: User) {
        return this.todoService.create(user.id, todo);
    }

    @Put(':id')
    async update(@Body() todo: Todo, @Param('id') idTodo: number, @GetUser() user: User) {
        return this.todoService.update(user.id, idTodo, todo);
    }

    @Delete(':id')
    async delete(@GetUser() user: User, @Param('id') id: number) {
         this.todoService.delete(user.id, id);
         return {
            msg: 'Delete Successfully',
         }
    }
}