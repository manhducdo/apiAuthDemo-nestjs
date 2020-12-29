import { Module, DynamicModule, Type } from '@nestjs/common';
import { GoogleStrategy } from './google.strategy';
import { ConfigService } from '@nestjs/config';
import { GoogleService } from './google.service';
import { GoogleConfig, GOOGLE_CONFIG_KEY } from './google.config';
import { ForwardReference } from '@nestjs/common/interfaces';
import { UsersModule } from 'src/users/users.module';

@Module({})
export class GoogleModule {
  public static CONFIG = 'GOOLE_MODULE_CONFIG';

  static register(
    config: GoogleConfig,
    imports: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    > = [],
  ): DynamicModule {
    return {
      module: GoogleModule,
      imports: [
        ConfigService,
        UsersModule,
        ...imports,
      ],
      providers: [
        GoogleService,
        GoogleStrategy,
        {
          provide: GOOGLE_CONFIG_KEY,
          useValue: config,
        },
      ],
    };
  }
}
