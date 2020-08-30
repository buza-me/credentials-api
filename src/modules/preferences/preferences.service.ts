import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { validateOrReject } from 'class-validator';
import { copyObjectProperties, logError } from '../../utils/helpers';
import { bridge } from '../../utils/bridgeProvider';
import { Preferences } from './preferences.schema';
import { CreatePreferencesDto, UpdatePreferencesDto } from './dto';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectModel(Preferences.name) private model: Model<Preferences>,
  ) {
    bridge.addActionListener('userCreated', (payload: string) =>
      this.create(payload),
    );
    bridge.addActionListener('userDeleted', async (payload: string) =>
      this.model.deleteMany({ userId: payload }),
    );
  }

  async create(userId: string): Promise<Preferences> {
    const existingPreferences: Preferences = await this.model.findOne({
      userId,
    });
    if (existingPreferences) {
      return existingPreferences;
    }
    try {
      const createTime: Date = new Date();
      const createDto: CreatePreferencesDto = copyObjectProperties<
        CreatePreferencesDto
      >(new CreatePreferencesDto(), {
        userId,
        theme: 'light',
        language: 'en',
        createTime,
        updateTime: createTime,
      });

      await validateOrReject(createDto);

      const createdPreferences: Preferences = new this.model(createDto);
      return createdPreferences.save();
    } catch (e) {
      logError(e, 'Create preferences');
      return e;
    }
  }

  async findOneByUserId(userId: string): Promise<Preferences> {
    return await this.model.findOne({ userId });
  }

  async findOneById(_id: string): Promise<Preferences> {
    return await this.model.findOne({ _id });
  }

  async updateOne(
    _id: string,
    updateDto: UpdatePreferencesDto,
  ): Promise<Preferences> {
    try {
      updateDto = copyObjectProperties<UpdatePreferencesDto>(
        new UpdatePreferencesDto(),
        { ...updateDto, updateTime: new Date() },
      );
      await validateOrReject(updateDto);
      const response: Response = await this.model.updateOne({ _id }, updateDto);
      console.log(response);
      if (response.ok) {
        return await this.model.findOne({ _id });
      }
    } catch (e) {
      logError(e, 'Update preferences');
      return e;
    }
  }

  async deleteOne(userId: string): Promise<void> {
    await this.model.deleteOne({ userId });
  }
}
