// import { Injectable } from '@nestjs/common';
// import { FolderService } from '../folder/folder.service';
// import { RecordService } from '../record/record.service';
// import { Folder } from '../folder/folder.schema';
// import { Record } from '../record/record.schema';

// type SavedFile = Folder & { children?: { folders: Folder[], records: Record[] } };

// @Injectable()
// export class SavedService {
//   async getSaved(userId: string): Promise<SavedFile> {
//     const folders = await this.folderService.findMany(userId);
//     const records = await this.recordService.findMany(userId);
//     const parentMap = new Map();

//     [...folders, ...records].forEach((item: Folder | Record) => {
//       const childrenArray = parentMap.get(item.parentId) || [];
//       childrenArray.push(item);
//       parentMap.set(item.parentId, childrenArray);
//     })

//     folders.forEach((folder: SavedFile) => {
//       const children = parentMap.get(folder._id) || [];
//       folder.children = {
//         folders: children.filter(child => child.objectType === 'folder'),
//         records: children.filter(child => child.objectType === 'record')
//       }
//     });

//     return parentMap.get(userId)[0];
//   }
// }
