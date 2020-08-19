import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { validateOrReject } from 'class-validator';
import { copyObjectProperties, logError } from '../../utils/helpers';
import { User } from './user.schema';
import { CreateUserDto, UpdateUserDto } from './dto';
import { bridge } from '../../utils/bridgeProvider';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  async create(createDto: CreateUserDto): Promise<string> {
    const { email } = createDto;
    const existingUser: User = await this.model.findOne({ email });

    if (!existingUser) {
      try {
        const createTime: Date = new Date();
        createDto = copyObjectProperties<CreateUserDto>(new CreateUserDto(), {
          ...createDto,
          createTime,
          updateTime: createTime,
        });

        await validateOrReject(createDto);

        const createdUser: User = new this.model(createDto);
        const saved: User = await createdUser.save();
        if (saved) {
          const { _id } = saved;
          try {
            const actionResults = await bridge.dispatchAction(
              'userCreated',
              _id,
            );
            const errors = actionResults.filter(
              result => result instanceof Error,
            );
            if (errors.length) {
              throw new Error(JSON.stringify(errors));
            }
            return _id;
          } catch {
            await this.model.deleteOne({ _id });
          }
        }
      } catch (e) {
        logError(e, 'Create user');
      }
    }
  }

  async findOneById(_id: string): Promise<Partial<User>> {
    const user: User = await this.model.findOne({ _id });
    if (user) {
      const { name, createTime, updateTime } = user;
      return { name, createTime, updateTime, _id };
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.model.findOne({ email });
  }

  async updateOne(_id: string, updateDto: UpdateUserDto): Promise<User> {
    const foundUser = await this.model.findOne({ _id });
    if (foundUser) {
      try {
        updateDto = copyObjectProperties<UpdateUserDto>(new UpdateUserDto(), {
          ...updateDto,
          updateTime: new Date(),
        });

        await validateOrReject(updateDto);

        const res: Response = await this.model.updateOne({ _id }, updateDto);
        if (res.ok) {
          return await this.model.findOne({ _id });
        }
      } catch (e) {
        logError(e, 'Update user');
      }
    }
  }

  async deleteOne(_id: string): Promise<void> {
    await this.model.deleteOne({ _id });
    await bridge.dispatchAction('userDeleted', _id);
  }
}
