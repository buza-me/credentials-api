import {
  Controller,
  Get,
  Request,
  UseGuards,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FolderService } from '../folder/folder.service';
import { RecordService } from '../record/record.service';
import { Folder } from '../folder/folder.schema';
import { Record } from '../record/record.schema';
import { getByObjectType } from '../../utils/helpers';

type Files = Array<Folder | Record>;

type SavedFile = Folder & {
  children?: { folders: Folder[]; records: Record[] };
};

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(
    private folderService: FolderService,
    private recordService: RecordService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async find(@Request() req: JwtRequest): Promise<any> {
    const userId: string = req.user._id;
    const folders = JSON.parse(
      JSON.stringify(await this.folderService.findMany(userId)),
    );
    const records = JSON.parse(
      JSON.stringify(await this.recordService.findMany(userId)),
    );
    const parentMap = new Map();

    [...folders, ...records].forEach((item: Folder | Record) => {
      const childrenArray = parentMap.get(item.parentId) || [];
      childrenArray.push(item);
      parentMap.set(item.parentId, childrenArray);
    });

    folders.forEach((folder: SavedFile) => {
      const children = parentMap.get(folder._id) || [];
      folder.children = {
        folders: getByObjectType(children, 'folder'),
        records: getByObjectType(children, 'record'),
      };
    });

    return parentMap.get(userId)[0];
  }

  @UseGuards(JwtAuthGuard)
  @Post('/move')
  async changeParent(
    @Query('$parentid') parentid: string,
    @Request() req: JwtRequest,
    @Body() files: Files,
  ): Promise<Files> {
    if (!files.length) {
      return;
    }
    const parentFolder: Folder = await this.folderService.findOne(parentid);
    const userId: string = req.user._id;
    const parentIdRef = files[0].parentId;

    if (!parentFolder || parentFolder.userId !== userId) {
      throw new Error();
    }

    const shouldThrowError = files.some(
      file =>
        file.userId !== userId ||
        file.parentId !== parentIdRef ||
        file.parentId === userId,
    );

    if (shouldThrowError) {
      throw new Error();
    }

    const folders = getByObjectType(files, 'folder');
    const records = getByObjectType(files, 'record');

    const updatedFolders = await this.folderService.updateParentIdForMany(
      folders,
      parentid,
    );
    const updatedRecords = await this.recordService.updateParentIdForMany(
      records,
      parentid,
    );

    return [...updatedFolders, ...updatedRecords];
  }
}
