import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/client/client.entity';
import { Repository } from 'typeorm';
import { Freelancer } from 'src/freelancer/freelancer.entity';

@Resolver()
export class AuthResolver {
    constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    @InjectRepository(Freelancer)
    private readonly freelancerRepository: Repository<Freelancer>,
  ) {}
 @Query(() => String)
  hello(): string {
    return 'Hello world!';
  }
  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    const result = await this.authService.login(user);
    return result.access_token + ' role ' + result.user.role;
  }

   @Mutation(() => User)
  async registerClient(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('nom') nom: string,
    @Args('photo') photo: string,
  ): Promise<User> {
    const user = await this.userService.create({ email, password, role: 'CLIENT' });

    const client = this.clientRepository.create({ nom, photo, user });
    await this.clientRepository.save(client);

    return user;
  }
  @Mutation(() => User)
  async registerFreelancer(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('nom') nom: string,
    @Args('prenom') prenom: string,
    @Args('photo') photo: string,
    @Args('bio', { nullable: true }) bio?: string,
  ): Promise<User> {
    const user = await this.userService.create({ email, password, role: 'FREELANCER' });

    const freelancer = this.freelancerRepository.create({ nom, prenom, photo, bio, user });
    await this.freelancerRepository.save(freelancer);

    return user;
  }
}
