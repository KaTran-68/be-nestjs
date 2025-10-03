import { Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (!user) return null;
    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!isValidPassword) return null;

    return user;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id };

    return {
      user: {
        email: user.email,
        _id: user._id,
        name: user.name,
        admin: user.admin,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async handleRegister(registerDto: CreateAuthDto) {
    return this.usersService.handleRegister(registerDto);
  }

  async checkCode(codeDto: CodeAuthDto) {
    return this.usersService.handleActive(codeDto);
  }

  async retryActive(data: string) {
    return this.usersService.retryActive(data);
  }

  async retryPassword(data: string) {
    return this.usersService.retryPassword(data);
  }

  async changePassword(data: ChangePasswordAuthDto) {
    return this.usersService.changePassword(data);
  }
}
