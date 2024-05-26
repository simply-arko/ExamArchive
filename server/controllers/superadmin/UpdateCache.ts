import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { User } from '../../models';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import redisClient from '../../config/redisConfig';
import { updateSchema } from '../../router/superadmin/schema';
import { SERVER_ERROR, SUCCESS_CODES } from '../../constants/statusCode';

const UpdateCache = asyncErrorHandler(async (req: Request, res: Response) => {
  const { role } = req.body.data as z.infer<typeof updateSchema>;
  if (redisClient === null) {
    throw new ErrorHandler(
      'Something went wrong. Please try again later',
      SERVER_ERROR['INTERNAL SERVER ERROR']
    );
  }
  const adminInfo = await User.find({ role })
    .select({ _id: 1, username: 1, email: 1, invitationStatus: 1 })
    .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
    .lean()
    .exec();
  const sanitizedInfo = adminInfo.map((info) => {
    const { _id: userId, email, username, invitationStatus } = info;
    return { userId, email, username, invitationStatus };
  });

  const saveInfoToCachePromises = sanitizedInfo.map((info) =>
    redisClient?.sadd(role, JSON.stringify(info))
  );
  await Promise.all(saveInfoToCachePromises);
  return res
    .status(SUCCESS_CODES['NO CONTENT'])
    .json({ message: 'Cache updated' });
});

export default UpdateCache;
