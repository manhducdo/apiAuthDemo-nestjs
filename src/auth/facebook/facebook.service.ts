import { Injectable } from '@nestjs/common';
// import * as _ from 'lodash';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/schema/user.schema';
import { CreateUserFacebookDto } from '../dto/create-user-facebook.dto';

@Injectable()
export class FacebookService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async findOrCreate(profile: any): Promise<User | undefined> {
    const facebook = await this.usersService.findOneByFacebookId(profile.id);
    // console.log('facebook', facebook);
    if(!facebook) {
      const fbCreate: CreateUserFacebookDto = {
        username: `fb_${profile.id}`,
        firstName: profile.name.familyName,
        lastName: profile.name.givenName,
        phone: profile.phone,
        email: profile.emails[0].value,
        facebookId: profile.id,
      };

      // console.log('fbCreate', fbCreate);
      // console.log('profile', profile);
      await this.usersService.createUserFacebook(fbCreate);
      return this.usersService.findOneByFacebookId(profile.id);
    }
    return facebook;
  }
}
