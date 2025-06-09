import { Injectable } from '@nestjs/common';
import { Client } from './client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
      ) {}
    
      async findAll(): Promise<Client[]> {
        return this.clientRepository.find({ relations: ['user'] });
      }
      async findOneById(id: number): Promise<Client|null> {
        return this.clientRepository.findOne({
        where: { id },
        relations: ['user'],
      });
    }
    async save(client: Client): Promise<Client> {
      return this.clientRepository.save(client);
    }
    
    async findByUserId(userId: number): Promise<Client | null> {
      return this.clientRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });
    }
}
