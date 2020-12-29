import { Injectable } from '@nestjs/common';
// import * as _ from 'lodash';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/schema/user.schema';
import { CreateUserGoogleDto } from '../dto/create-user-google';


@Injectable()
export class GoogleService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async findOrCreate(profile: any): Promise<User | undefined> {
    // console.log('profileGoogle', profile);
    const google = await this.usersService.findOneByGoogleId(profile.id);
    console.log('google', google);
    if(!google) {
      const googleCreate: CreateUserGoogleDto = {
        username: `google_${profile.id}`,
        firstName: profile.name.familyName,
        lastName: profile.name.givenName,
        phone: profile.phone,
        email: profile.emails[0].value,
        googleId: profile.id,
      };

      // console.log('fbCreate', fbCreate);
      // console.log('profile', profile);
      await this.usersService.createUserGoogle(googleCreate);
      return this.usersService.findOneByGoogleId(profile.id);
    }
    return google;
  }
}
