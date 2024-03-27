import { User } from '@entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({default: false})
  completed: boolean;

  @ManyToOne(() => User, (user: User) => user.todos)
  user: User;
  
  constructor(partial: Partial<Todo>) {
    Object.assign(this, partial);
  }
}