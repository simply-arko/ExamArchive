import getSearchRequestObj from './search';
import { getResetObj, getSignInObj, getSignUpObj } from './auth';
import { getFileObj, deleteFileObj } from './file';
import { reportObj, resolveReportObj, viewReportsObj } from './report';
import {
  getFilesDataObj,
  createFolderObj,
  getFolderNameObj,
  deleteFolderObj,
} from './folder';
import {
  getCommentsObj,
  postCommentObj,
  deleteCommentObj,
  editCommentObj,
  reactToCommentObj,
} from './comments';
import {
  getModeratorsObj,
  removeModeratorObj,
  addModeratorObj,
} from './superadmin';

export {
  getSearchRequestObj,
  getSignInObj,
  getSignUpObj,
  getResetObj,
  getFileObj,
  reportObj,
  resolveReportObj,
  viewReportsObj,
  deleteFileObj,
  getFilesDataObj,
  createFolderObj,
  getFolderNameObj,
  deleteFolderObj,
  getCommentsObj,
  postCommentObj,
  deleteCommentObj,
  editCommentObj,
  reactToCommentObj,
  getModeratorsObj,
  removeModeratorObj,
  addModeratorObj,
};
