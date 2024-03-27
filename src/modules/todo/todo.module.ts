import { Module } from '@nestjs/common';
import { TodoService } from '@service/todo.service';
import { TodoController } from '@controller/todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '@entity/todo.entity';
import { User } from '@entity/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Todo, User])],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
