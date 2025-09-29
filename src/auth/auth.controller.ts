import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public, ResponseMessage } from '@/decorator/customize';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @ResponseMessage('Fetch login')
  handleLogin(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  async register(@Body() registerDto: CreateAuthDto) {
    return await this.authService.handleRegister(registerDto);
  }

  @Post('check-code')
  @Public()
  async checkcode(@Body() codeDto: CodeAuthDto) {
    return await this.authService.checkCode(codeDto);
  }

  @Post('retry-active')
  @Public()
  async retryActive(@Body('email') email: string) {
    return await this.authService.retryActive(email);
  }

  @Post('retry-password')
  @Public()
  async retryPassword(@Body('email') email: string) {
    return await this.authService.retryPassword(email);
  }

  @Post('change-password')
  @Public()
  async changePassword(@Body() data: ChangePasswordAuthDto) {
    return await this.authService.changePassword(data);
  }

  @Get('mail')
  @Public()
  testmail() {
    this.mailerService
      .sendMail({
        to: 'tkhoa06082005@gmail.com', // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        template: 'register.hbs',
        context: {
          name: 'KaTran',
          activationCode: 123456,
        },
      })
      .then(() => {})
      .catch(() => {});
    return 'ok';
  }
}
