import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Message } from './messages.entity';
import { CreateMessageInput } from './messages.input';

@Injectable()
export class MessagesService {
    constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Message)
    private userRepository: Repository<User>,
  ) {}

  async create(input: CreateMessageInput, sender: User): Promise<Message> {
    const message = this.messageRepository.create({
      content: input.content,
      sender,
      receiver: { id: input.receiverId },
    });
    return this.messageRepository.save(message);
  }

//   async create(input: CreateMessageInput, sender: User): Promise<Message> {
//   // Chargez d'abord le receiver complet avec ses relations
//   const receiver = await this.userRepository.findOne({
//     where: { id: input.receiverId },
//     relations: ['freelancer', 'client'] // Charge les relations nécessaires
//   });

//   if (!receiver) {
//     throw new Error('Receiver not found');
//   }

//   const message = this.messageRepository.create({
//     content: input.content,
//     sender, // L'expéditeur est déjà chargé complètement
//     receiver // Utilisez l'objet user complet chargé
//   });

//   return this.messageRepository.save(message);
// }

  async findConversation(userId: number, withUserId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { sender: { id: userId }, receiver: { id: withUserId } },
        { sender: { id: withUserId }, receiver: { id: userId } },
      ],
      order: { createdAt: 'ASC' },
      relations: ['sender', 'receiver','sender.freelancer','sender.client','receiver.freelancer','receiver.client'],
    });
  }
  
}
