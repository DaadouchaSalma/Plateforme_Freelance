import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from './user.entity';

@Resolver()
export class UserResolver {
    @Query(() => User)
@UseGuards(JwtAuthGuard)
me(@CurrentUser() user: User) {
  return user;
}
}
