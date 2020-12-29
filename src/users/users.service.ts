import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/create-register.dto';
import { CreateUserFacebookDto } from 'src/auth/dto/create-user-facebook.dto';
import { CreateUserGoogleDto } from 'src/auth/dto/create-user-google';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { utils } from '../utils/hashPassword';


@Injectable()
export class UsersService {
  constructor( @InjectModel(User.name) private readonly userModel: Model<UserDocument>,) {
    
  }
  //Login
  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await utils.hashPassword(createUserDto.password);
    const createUser = new this.userModel(createUserDto);
    return createUser.save();
  }

  
  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({username});
  }

  //Login using facebook
  async findOneByFacebookId(facebookId: string): Promise<User | undefined> {
    return this.userModel.findOne({facebookId});
  }

  async createUserFacebook(createUserFacebookDto: CreateUserFacebookDto) {
    const createUserFacebook = new this.userModel(createUserFacebookDto);
    return createUserFacebook.save();
  }


  //Login using google
  async findOneByGoogleId(googleId: string): Promise<User | undefined> {
    return this.userModel.findOne({googleId});
  }

  async createUserGoogle(createUserGoogleDto: CreateUserGoogleDto) {
    const createUserGoogle = new this.userModel(createUserGoogleDto);
    return createUserGoogle.save();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
}
}
