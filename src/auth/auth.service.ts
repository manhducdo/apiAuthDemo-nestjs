import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-register.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  private clientAppUrl: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {
    this.clientAppUrl = this.configService.get<string>('FE_APP_URL');
  }

  async validateUser(username: string, pass: string): Promise<any> {
    //console.log('validate user');
    const user = await this.usersService.findOne(username);

    const match = await bcrypt.compare(pass, user.password);

    if (match) {
      const { password, ...result } = user;

      return result;
    }
    return null;
  }

  //Login
  async login(user: any) {
    //console.log('userDoc', user._doc);
    const payload = { username: user._doc.username, id: user._doc._id };
    const options = { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRES )};
    //  console.log('payload', payload);
    return {
      id: user._doc._id,
      username: user._doc.username,
      fistName: user._doc.firstName,
      lastName: user._doc.lastName,
      phone: user._doc.phone,
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, options),
    };
  }

  //Register
  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  //Forgot password
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
        throw new BadRequestException('Invalid email');
    }
    const payload = { username: user.username, sub: user.userId };
    const token = await this.jwtService.sign(payload);
    const forgotLink = `${this.clientAppUrl}/auth/forgotPassword?token=${token}`;

    await this.mailService.send({
        from: this.configService.get<string>('JS_CODE_MAIL'),
        to: user.email,
        subject: 'Forgot Password',
        html: `
            <h3>Hello ${user.firstName}!</h3>
            <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
        `,
    });
  }
}
