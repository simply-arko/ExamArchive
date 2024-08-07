import { z } from 'zod';
import { Request, Response } from 'express';

import { DOC_INFO_TTL_IN_SECONDS } from '../../../constants/constants/filePreview';
import { ErrorHandler } from '../../../utils/errors/errorHandler';
import { FILE_UPLOAD_STATUS } from '../../../constants/constants/upload';
import { MONGO_READ_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import Question from '../../../models/question';
import asyncErrorHandler from '../../../utils/errors/asyncErrorHandler';
import { getFileInputSchema } from '../../../router/filePreview/data/schema';
import redisClient from '../../../config/redisConfig';
import { ERROR_CODES, SUCCESS_CODES } from '../../../constants/statusCode';

const GetFile = asyncErrorHandler(async (req: Request, res: Response) => {
  const { postId } = req.params as unknown as z.infer<
    typeof getFileInputSchema
  >;
  const redisKey = `post:${postId}`;
  if (redisClient) {
    const docInfo = await redisClient.get(redisKey);
    if (docInfo !== null) {
      return res.status(SUCCESS_CODES.OK).json({ data: docInfo });
    }
  }
  const docInfo = await Question.findOne({
    _id: postId,
    status: FILE_UPLOAD_STATUS.UPLOADED,
  })
    .populate({ path: 'uploadedBy', select: { username: 1, _id: 1 } })
    .select({
      'noOfDownloads.userIds': 0,
      'noOfDownloads.ips': 0,
      'noOfViews.userIds': 0,
      'noOfViews.ips': 0,
      'file.filename': 0,
      'file.publicId': 0,
    })
    .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
    .lean()
    .exec();
  if (!docInfo) {
    throw new ErrorHandler(
      'No document found with the given postId',
      ERROR_CODES['NOT FOUND']
    );
  }
  if ((docInfo as any).isFlagged === true) {
    throw new ErrorHandler(
      'The content on this page was taken down by the team due to the violation of terms',
      ERROR_CODES['BAD REQUEST']
    );
  }
  if (redisClient) {
    await redisClient.set(
      redisKey,
      JSON.stringify(docInfo),
      'EX',
      DOC_INFO_TTL_IN_SECONDS
    );
  }
  return res.status(SUCCESS_CODES.OK).json({ data: JSON.stringify(docInfo) });
});

export default GetFile;
