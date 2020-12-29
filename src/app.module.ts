import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { configModule } from './configure.root';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ 
    MongooseModule.forRoot('mongodb://localhost:27017/test'), 
    configModule,
    AuthModule, 
    UsersModule, 
    MailModule,
  ]
})
export class AppModule {}
