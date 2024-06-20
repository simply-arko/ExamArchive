import { AnyZodObject } from 'zod';
import express from 'express';

import { ROLE } from '../../constants/constants/auth';
import privilege from '../../middlewares/previlege';
import validate from '../../middlewares/validate';
import verifyUser from '../../middlewares/verifyUser';
import {
  AddNameToCache,
  GetStats,
  NotificationWebhook,
  UploadFile,
} from '../../controllers/upload';
import { addNamesInputSchema, uploadFilesInputSchema } from './schema';

const router = express.Router();

router.get('/getStats', [verifyUser, privilege([ROLE.ADMIN])], GetStats);
router.post(
  '/',
  [
    verifyUser,
    privilege([ROLE.ADMIN]),
    validate(uploadFilesInputSchema as unknown as AnyZodObject, 'BODY'),
  ],
  UploadFile
);
router.post('/webhook', NotificationWebhook);
router.put(
  '/addNames',
  [
    verifyUser,
    privilege([ROLE.ADMIN]),
    validate(addNamesInputSchema as unknown as AnyZodObject, 'BODY'),
  ],
  AddNameToCache
);

// TODO : create a route to get instution names for suggestions

export default router;
