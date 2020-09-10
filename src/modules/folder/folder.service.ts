import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { validateOrReject } from 'class-validator';
import { copyObjectProperties, logError } from '../../utils/helpers';
import { Folder } from './folder.schema';
import { CreateFolderDto, UpdateFolderDto } from './dto';
import { bridge } from '../../utils/bridgeProvider';

@Injectable()
export class FolderService {
  constructor(@InjectModel(Folder.name) private model: Model<Folder>) {
    bridge.addActionListener('userCreated', (payload: string) =>
      this.userCreatedListener(payload),
    );
    bridge.addActionListener('userDeleted', async (payload: string) =>
      this.model.deleteMany({ userId: payload }),
    );
  }

  async userCreatedListener(payload: string): Promise<Folder> {
    const parentId: string = payload;
    const existingRootFolder: Folder = await this.model.findOne({ parentId });
    if (!existingRootFolder) {
      const createDto: Partial<CreateFolderDto> = {
        name: 'root',
        parentId,
        userId: parentId,
      };
      return this.create(createDto);
    }
  }

  async findOne(_id: string): Promise<Folder> {
    return this.model.findOne({ _id });
  }

  async findMany(userId: string): Promise<Folder[]> {
    return this.model.find({ userId });
  }

  async create(createDto: Partial<CreateFolderDto>): Promise<Folder> {
    try {
      const createTime: Date = new Date();
      createDto = copyObjectProperties<CreateFolderDto>(new CreateFolderDto(), {
        ...createDto,
        createTime,
        updateTime: createTime,
      } as CreateFolderDto);

      await validateOrReject(createDto);

      const createdFolder: Folder = new this.model(createDto);
      return createdFolder.save();
    } catch (e) {
      logError(e, 'Create folder');
      return e;
    }
  }

  async updateOne(_id: string, updateDto: UpdateFolderDto): Promise<Folder> {
    try {
      updateDto = copyObjectProperties<UpdateFolderDto>(new UpdateFolderDto(), {
        ...updateDto,
        updateTime: new Date(),
      });

      await validateOrReject(updateDto);

      const response: Response = await this.model.updateOne({ _id }, updateDto);
      if (response.ok) {
        return await this.model.findOne({ _id });
      }
    } catch (e) {
      logError(e, 'Update folder');
      return e;
    }
  }

  async getFoldersRecursively(parent: Folder): Promise<Folder[]> {
    let collection = [parent];
    const folders = await this.model.find({ parentId: parent._id });
    if (folders?.length) {
      folders.forEach(async folder => {
        const collected = await this.getFoldersRecursively(folder);
        collection = [...collected];
      });
    }
    return collection;
  }

  async deleteOne(_id: string): Promise<void> {
    const folder = await this.model.findOne({ _id });
    if (folder.parentId === folder.userId) {
      return;
    }
    const foldersToDelete = await this.getFoldersRecursively(folder);
    const folderIds = foldersToDelete.map(folder => folder._id);
    await this.model.deleteMany({ _id: { $in: folderIds } });
    await bridge.dispatchAction('foldersDeleted', folderIds);
  }

  async updateParentIdForMany(
    folders: Array<Folder>,
    parentId: string,
  ): Promise<Folder[]> {
    const updateDto: UpdateFolderDto = copyObjectProperties<UpdateFolderDto>(
      new UpdateFolderDto(),
      {
        parentId: parentId,
        updateTime: new Date(),
      },
    );

    const ids = folders.map(record => record._id);

    const response: Response = await this.model.updateMany(
      { _id: { $in: ids } },
      updateDto,
    );

    if (response.ok) {
      return await this.model.find({ _id: { $in: ids } });
    } else {
      return [];
    }
  }
}
