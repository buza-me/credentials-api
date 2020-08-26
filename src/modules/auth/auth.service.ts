import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: User): Promise<any> {
    const payload = { username: user.name, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      userId: user._id,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user: any = await this.userService.findOneByEmail(email);

    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, email, ...rest } = user?._doc;
      return rest;
    }
    return null;
  }
}
