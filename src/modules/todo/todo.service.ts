import { Todo } from '@modules/todo/entity/todo.entity';
import { User } from '@modules/user/entity/user.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoDto } from './dto/todo.dto';


@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject(CACHE_MANAGER) private cache: Cache
    ) { }

    async findAll(userId: number): Promise<Todo[]> {
        console.log(userId);
        const cacheTodo = await this.cache.get<Todo[]>('todos');
        if(cacheTodo){
            console.log('Data from Cache!');
            return cacheTodo;
        }
        const user = await this.userRepository.findOne({
            where: { id: userId }, relations: ['todos']
        });
        await this.cache.set('todos', user.todos, 0);
        console.log('Data from Database!');
        return user.todos;
    }

    async create(userId: number, todo: TodoDto): Promise<Todo> {
        const user = await this.userRepository.findOne({ 
            where: { id: userId } 
        });
        for (let i = 0; i < 500000; i++) {
            const newTodo = this.todoRepository.create({ ...todo, user });
            await this.todoRepository.save(newTodo);
        }
        const newTodo = this.todoRepository.create({ ...todo, user });
        //await this.cache.del('todos');
        return this.todoRepository.save(newTodo);
    }

    async update(userId: number, todoId: number, todo: TodoDto): Promise<Todo> {
        console.log(todo);
        await this.todoRepository.update({ 
            id: todoId, user: { id: userId } 
        }, {...todo});
        //await this.cache.del('todos');
        return this.todoRepository.findOne({ 
            where: { id: todoId, user: { id: userId } } 
        });
    }

    async delete(userId: number, todoId: number) {
        const todo = await this.todoRepository.findOne({
            where: {
                id: todoId,
                user: { id: userId }
            }
        })
        //console.log(todo);
        if(!todo) return {
           msg: 'Delete Fail',
        };
        await this.todoRepository.delete({ 
            id: todoId, user: { id: userId } 
        });
        //await this.cache.del('todos');   
        return {
            msg: 'Delete Successful',
        };
    }
}