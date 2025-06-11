import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';
import { Client } from 'src/client/client.entity';
import { Freelancer } from 'src/freelancer/freelancer.entity';

@Injectable()
export class FeedbackService {
    constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    @InjectRepository(Freelancer)
    private readonly freelancerRepository: Repository<Freelancer>,
  ) {}

  async createFeedback(
    senderUser: User,
    receiverId: number,
    receiverType: 'FREELANCER' | 'CLIENT',
    rating: number,
    comment: string,
  ): Promise<Feedback> {
    const feedback = new Feedback();
    feedback.rating = rating;
    feedback.comment = comment;

    // Determine sender type based on logged user role
    if (senderUser.role === 'FREELANCER') {
      const senderFreelancer = await this.freelancerRepository.findOne({ where: { user: { id: senderUser.id } } });
      if (!senderFreelancer) throw new Error('Sender freelancer not found');
      feedback.senderfreelancer = senderFreelancer;
    } else if (senderUser.role === 'CLIENT') {
      const senderClient = await this.clientRepository.findOne({ where: { user: { id: senderUser.id } } });
      if (!senderClient) throw new Error('Sender client not found');
      feedback.senderClient = senderClient;
    } else {
      throw new Error('Sender must be Freelancer or Client');
    }

    // Set receiver based on type
    if (receiverType === 'FREELANCER') {
      const receiverFreelancer = await this.freelancerRepository.findOne({ where: { id: receiverId } });
      if (!receiverFreelancer) throw new Error('Receiver freelancer not found');
      feedback.receiverfreelancer = receiverFreelancer;
    } else if (receiverType === 'CLIENT') {
      const receiverClient = await this.clientRepository.findOne({ where: { id: receiverId } });
      if (!receiverClient) throw new Error('Receiver client not found');
      feedback.receiverClient = receiverClient;
    } else {
      throw new Error('Receiver type invalid');
    }

    return this.feedbackRepository.save(feedback);
  }
}
