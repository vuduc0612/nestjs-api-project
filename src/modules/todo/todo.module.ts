import { Module } from '@nestjs/common';
import { TodoService } from '@modules/todo/todo.service';
import { TodoController } from '@modules/todo/todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '@modules/todo/entity/todo.entity';
import { User } from '@modules/user/entity/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Todo, User])],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
