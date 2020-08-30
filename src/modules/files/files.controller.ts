import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FolderService } from '../folder/folder.service';
import { RecordService } from '../record/record.service';
import { Folder } from '../folder/folder.schema';
import { Record } from '../record/record.schema';

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
        folders: children.filter(child => child.objectType === 'folder'),
        records: children.filter(child => child.objectType === 'record'),
      };
    });

    return parentMap.get(userId)[0];
  }
}
