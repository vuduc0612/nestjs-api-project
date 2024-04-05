// src/user/user.entity.ts

import { Todo } from '@modules/todo/entity/todo.entity';
import { Exclude } from 'class-transformer';

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  firstName: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}