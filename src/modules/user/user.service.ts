import { Injectable, Inject } from "@nestjs/common";
import { User } from "@modules/user/entity/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, 
    @Inject(CACHE_MANAGER) private cacheManager: Cache) { }
  async findAll(): Promise<User[]>{
    const cachedUsers = await this.cacheManager.get<User[]>('users');
    if (cachedUsers) {
      console.log('Data from Cache!');
      return cachedUsers;
    }

    const users = await this.userRepository.find();
    await this.cacheManager.set('users', users, 0);
    console.log('Data from DataBase!');
    return users;
  }
}

