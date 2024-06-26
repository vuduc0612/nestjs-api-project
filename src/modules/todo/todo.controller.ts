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
import { TodoService } from '@modules/todo/todo.service';
import { User } from '@modules/user/entity/user.entity';
import { Todo } from '@modules/todo/entity/todo.entity';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { GetUser } from '@modules/auth/decorator/get-user.decorator';
import { TodoInterceptor } from '@modules/todo/interceptor/todo.interceptor';
import { TodoDto } from './dto/todo.dto';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('todos')
export class TodoController {
    constructor(private todoService: TodoService) { }
    
    @UseInterceptors(TodoInterceptor)
    @Get()
    async findAll(@GetUser() user: User) {
        //console.log(user);
        return this.todoService.findAll(user.id);
    }

    @Post()
    async create(@Body() todo: TodoDto, @GetUser() user: User) {
        //console.log(user);
        return this.todoService.create(user.id, todo);
    }

    @Put(':id')
    async update(@Body() todo: TodoDto, @Param('id') idTodo: number, @GetUser() user: User) {
        return this.todoService.update(user.id, idTodo, todo);
    }

    @Delete(':id')
    async delete(@GetUser() user: User, @Param('id') id: number) {
        return this.todoService.delete(user.id, id);
    }
}