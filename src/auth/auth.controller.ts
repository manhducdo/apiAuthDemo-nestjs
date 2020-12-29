import { Controller, Get, Post, Request, UseGuards, Body, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
  }

    @UseGuards(AuthGuard('facebook-token'))
    @Post('facebook-token')
    async connectWithFacebook(
        @Request() req,
    ) {
        console.log('req', req.user);
        return this.authService.login(req.user);
    }

    @UseGuards(AuthGuard('google-token'))
    @Post('google-token')
    async connectWithGoogle(
        @Request() req,
    ) {
        console.log('req', req.user);
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    getProfile(@Request() req) {
        return this.usersService.findOne(req.user.username);
    }

    @Post('forgot-password')
    async forgotPassword(@Body(new ValidationPipe()) forgotPasswordDto: ForgotPasswordDto): Promise<void> {
        return this.authService.forgotPassword(forgotPasswordDto);
    }
}

