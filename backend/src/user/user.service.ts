import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(data: { email: string; password: string; role: string }): Promise<User> {
    const user = new User();
    user.email = data.email;
    user.password = await bcrypt.hash(data.password, 10);
    /*if (!Object.values(UserRole).includes(data.role as UserRole)) {
       throw new Error('Invalid user role');
    }
    user.role = data.role as UserRole;*/
     user.role = data.role;
    return this.userRepository.save(user);
  }
}
