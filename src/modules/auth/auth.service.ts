import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';
import { TOKEN_LIFE_LENGTH } from './constants';
import { compareWithHash } from '../../utils/helpers';

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
      willExpireTime: new Date(Date.now() + TOKEN_LIFE_LENGTH * 1000),
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user: any = await this.userService.findOneByEmail(email);

    const isValid = user && (await compareWithHash(password, user.password));
    console.log(isValid);
    if (isValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, email, ...rest } = user?._doc;
      return rest;
    }
    return null;
  }
}
