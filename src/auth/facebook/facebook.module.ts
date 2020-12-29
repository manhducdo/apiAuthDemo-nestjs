import { Module, DynamicModule, Type } from '@nestjs/common';
import { FacebookStrategy } from './facebook.strategy';
import { ConfigService } from '@nestjs/config';
import { FacebookService } from './facebook.service';
import { FacebookConfig, FACEBOOK_CONFIG_KEY } from './facebook.config';
import { ForwardReference } from '@nestjs/common/interfaces';
import { UsersModule } from '../../users/users.module';

@Module({})
export class FacebookModule {
  public static CONFIG = 'FACEBOOK_MODULE_CONFIG';

  static register(
    config: FacebookConfig,
    imports: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    > = [],
  ): DynamicModule {
    return {
      module: FacebookModule,
      imports: [
        ConfigService,
        UsersModule,
        ...imports,
      ],
      providers: [
        FacebookService,
        FacebookStrategy,
        {
          provide: FACEBOOK_CONFIG_KEY,
          useValue: config,
        },
      ],
    };
  }
}
