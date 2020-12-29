import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { FacebookModule } from './facebook/facebook.module';
import { GoogleModule } from './google/google.module';
import { MailModule } from 'src/mail/mail.module';

const jwtModuleRegister = JwtModule.register({
  secret: jwtConstants.secret,
  signOptions: { expiresIn: '7d' },
});

// console.log(process.env.FACEBOOK_SECRET);

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MailModule,
    FacebookModule.register(
      {
        clientId: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET
      },
      [jwtModuleRegister]
    ),
    GoogleModule.register(
      {
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      },
      [jwtModuleRegister]
    ),
    jwtModuleRegister,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
