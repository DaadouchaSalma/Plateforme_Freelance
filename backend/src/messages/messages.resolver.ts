import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/user.entity';
import { Message } from './messages.entity';
import { CreateMessageInput } from './messages.input';
import { MessagesService } from './messages.service';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Resolver()
export class MessagesResolver {
    constructor(private readonly messagesService: MessagesService,@ InjectRepository(User)
    private readonly userRepo: Repository<User>) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Message)
  async sendMessage(
    @Args('createMessageInput') input: CreateMessageInput,
    @CurrentUser() user: User,
  ): Promise<Message> {
    return this.messagesService.create(input, user);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Message])
  async getConversation(
    @Args('withUserId', { type: () => Int }) withUserId: number,
    @CurrentUser() user: User,
  ): Promise<Message[]> {
    console.log('Type de withUserId:', typeof withUserId);

    console.log('Request from user:', user.id, 'to chat with:', withUserId);
    if (!withUserId) {
      throw new BadRequestException('User ID is required');
    }
    return this.messagesService.findConversation(user.id, withUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [User])
  async getAvailableContacts(@CurrentUser() currentUser: any): Promise<User[]> {
    return this.userRepo.find({
      where: { id: Not(currentUser.id),role: Not('ADMIN'), },
      relations: ['freelancer', 'client'],
    });
  }

}
