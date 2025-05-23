import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Resolver()
export class AuthResolver {
    constructor(
    private authService: AuthService,
    private userService: UserService,
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
    return result.access_token;
  }

  @Mutation(() => User)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('role') role: string,
  ) {
    return this.userService.create({ email, password, role });
  }
}
