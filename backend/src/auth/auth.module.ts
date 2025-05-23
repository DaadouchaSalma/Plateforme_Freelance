import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';


@Module({
    imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
})
export class AuthModule {}
