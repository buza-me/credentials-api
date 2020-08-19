import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { validateOrReject } from 'class-validator';
import { copyObjectProperties, logError } from '../../utils/helpers';
import { Record } from './record.schema';
import { CreateRecordDto, UpdateRecordDto } from './dto';
import { bridge } from '../../utils/bridgeProvider';

@Injectable()
export class RecordService {
  constructor(@InjectModel(Record.name) private model: Model<Record>) {
    bridge.addActionListener('userDeleted', async (payload: string) =>
      this.model.deleteMany({ userId: payload }),
    );
  }

  async create(createDto: CreateRecordDto): Promise<Record> {
    try {
      const createTime: Date = new Date();
      createDto = copyObjectProperties<CreateRecordDto>(new CreateRecordDto(), {
        ...createDto,
        createTime,
        updateTime: createTime,
      });

      await validateOrReject(createDto);

      const createdRecord = new this.model(createDto);
      return createdRecord.save();
    } catch (e) {
      logError(e, 'Create record');
      return e;
    }
  }

  async updateOne(_id: string, updateDto: UpdateRecordDto): Promise<Record> {
    try {
      updateDto = copyObjectProperties(new UpdateRecordDto(), {
        ...updateDto,
        updateTime: new Date(),
      });

      await validateOrReject(updateDto);

      const response: Response = await this.model.updateOne({ _id }, updateDto);

      if (response.ok) {
        return await this.model.findOne({ _id });
      }
    } catch (e) {
      logError(e, 'Update record');
      return e;
    }
  }

  async findOne({ id, parentId }): Promise<Record> {
    return this.model.findOne(id ? { _id: id } : { parentId });
  }

  async findOneById(_id: string): Promise<Record> {
    return this.model.findOne({ _id });
  }

  async deleteOne(_id: string): Promise<void> {
    await this.model.deleteOne({ _id });
  }
}
