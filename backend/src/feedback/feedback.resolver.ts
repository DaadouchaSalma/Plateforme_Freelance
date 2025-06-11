import { UseGuards } from '@nestjs/common';
import { Float, Int } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/user.entity';
import { Feedback } from './feedback.entity';
import { FeedbackService } from './feedback.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Query, Mutation, Args, Resolver } from '@nestjs/graphql'; // from graphql, not common
import { ClientService } from 'src/client/client.service';
import { FreelancerService } from 'src/freelancer/freelancer.service';


@Resolver()
export class FeedbackResolver {
    constructor(
        private readonly feedbackService: FeedbackService,
        private readonly freelancerService: FreelancerService,
        private readonly clientService: ClientService,
        @InjectRepository(Feedback)
            private readonly feedbackRepository: Repository<Feedback>,
    
    ) {}
    @UseGuards(JwtAuthGuard)
@Mutation(() => Feedback)
async createFeedback(
  @CurrentUser() user: User,  // logged-in user info
  @Args('receiverId', { type: () => Int }) receiverId: number,
  @Args('receiverType', { type: () => String }) receiverType: 'FREELANCER' | 'CLIENT',
  @Args('rating', { type: () => Float }) rating: number,
  @Args('comment') comment: string,
): Promise<Feedback> {
    console.log('createFeedback: ', user.id, user.role, receiverId, receiverType, rating, comment)
  return this.feedbackService.createFeedback(user, receiverId, receiverType, rating, comment);
}

@UseGuards(JwtAuthGuard)
@Query(() => [Feedback])
async getMyFeedbacks(
  @CurrentUser() user: User,
): Promise<Feedback[]> {
  const userId = user.id;
  const userType = user.role as 'FREELANCER' | 'CLIENT';
  console.log('user ID:', userId, userType);

  if (userType === 'FREELANCER') {
    const freelancer = await this.freelancerService.findByUserId(userId);
    if (!freelancer) throw new Error('Freelancer not found');

    return this.feedbackRepository.find({
      where: [{ receiverfreelancer: { id: freelancer.id } }],
      relations: [
    'senderfreelancer', 
    'senderfreelancer.user',  // Include user relation for senderfreelancer
    'senderClient', 
    'senderClient.user',      // Include user relation for senderClient
    'receiverfreelancer', 
    'receiverClient'
  ],
      order: { createdAt: 'DESC' },
    });
  }

  if (userType === 'CLIENT') {
    const client = await this.clientService.findByUserId(userId);
    if (!client) throw new Error('Client not found');
    console.log('client ID:', client.id);

    return this.feedbackRepository.find({
      where: [{ receiverClient: { id: client.id } }],
      relations: [
    'senderfreelancer', 
    'senderfreelancer.user',  // Include user relation for senderfreelancer
    'senderClient', 
    'senderClient.user',      // Include user relation for senderClient
    'receiverfreelancer', 
    'receiverClient'
  ],
      order: { createdAt: 'DESC' },
    });
  }

  throw new Error('Invalid user type');
}

@UseGuards(JwtAuthGuard)
@Query(() => [Feedback])
async getFeedbacksByUserId(
  @Args('userId', { type: () => Int }) userId: number,
  @Args('userType', { type: () => String }) userType: 'FREELANCER' | 'CLIENT',
): Promise<Feedback[]> {
    console.log(userId, userType)
  if (userType === 'FREELANCER') {
    return this.feedbackRepository.find({
      where: [{ receiverfreelancer: { id: userId } }],
      relations: [
    'senderfreelancer', 
    'senderfreelancer.user',  // Include user relation for senderfreelancer
    'senderClient', 
    'senderClient.user',      // Include user relation for senderClient
    'receiverfreelancer', 
    'receiverClient'
  ],
      order: { createdAt: 'DESC' },
    });
  }

  if (userType === 'CLIENT') {
    const req = this.feedbackRepository.find({
      where: [{ receiverClient: { id: userId } }],
      relations: [
    'senderfreelancer', 
    'senderfreelancer.user',  // Include user relation for senderfreelancer
    'senderClient', 
    'senderClient.user',      // Include user relation for senderClient
    'receiverfreelancer', 
    'receiverClient'
  ],
      order: { createdAt: 'DESC' },
    });
    console.log('req: ', req)
    return this.feedbackRepository.find({
      where: [{ receiverClient: { id: userId } }],
      relations: [
    'senderfreelancer', 
    'senderfreelancer.user',  // Include user relation for senderfreelancer
    'senderClient', 
    'senderClient.user',      // Include user relation for senderClient
    'receiverfreelancer', 
    'receiverClient'
  ],
      order: { createdAt: 'DESC' },
    });
  }

  throw new Error('Invalid user type');
}


}
