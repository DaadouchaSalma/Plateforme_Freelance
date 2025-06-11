import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { Message } from './messages.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message,User])],
  providers: [MessagesService, MessagesResolver]
})
export class MessagesModule {}
